import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { User } from 'src/user/user.model';
import { Connection, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { resetPasswordTemplate } from 'src/mail/templates/password-reset.template';
import { emailVerificationTemplate } from 'src/mail/templates/email-confirmation.template';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private mailService: MailService,
    @InjectModel(User.name) private userModel: Model<User>,
		@InjectConnection() private readonly connection: Connection,
    private jwtService: JwtService,
  ) {}

  async signup(signupData: SignupDto) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { name, email, password } = signupData;
      // Check if email already exists
      const existingUser = await this.userModel.findOne({ email }).session(session);
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      // Create user
      await this.userModel.create(
        [
          {
            name,
            email,
            password: hashedPassword,
            otp,
            is_verified: false,
          },
        ],
        { session },
      );

      // You **can** optionally save the OTP in the DB or email it directly
      await this.sendVerificationEmail(otp, email);

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return { message: 'User created successfully. Please check your email.' };

    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      if (error instanceof BadRequestException) throw error;

      if (error.code === 11000 && error.keyPattern?.email) {
        throw new BadRequestException('Email already in use');
      }

      console.error('Signup Error:', error);
      throw new Error('An unexpected error occurred during signup');
    }
  }


  async login(LoginData: LoginDto) {
    const { email, password } = LoginData;
    // check if the user exists
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }
		if (user && !user.is_verified) {
			throw new UnauthorizedException('Email not verified');
		}
    // check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    // Generate JWT token

    return this.generateUserToken(user._id);
  }
  async generateUserToken(userId) {
    const accessToken = this.jwtService.sign({ userId });

    return { accessToken };
  }
  async gettoken(id: number, email: string, time: string): Promise<string> {
    return await this.jwtService.signAsync(
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        sub: id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        email: email,
      },
      {
        expiresIn: time,
        secret: this.config.get('JWT_SECRET'),
      },
    );
  }
  //forgot password
  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = await this.gettoken(user.id, user.email, '1d');
    const resetUrl = `${process.env.URL}/auth/reset-password`;
    const hashed = await bcrypt.hash(token, 10);
    await this.userModel.updateOne(
      { email },
      {
        resetPasswordToken: hashed,
        resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour from now
      },
    );
    const mjmlTemplate = resetPasswordTemplate(resetUrl, token);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await this.mailService.sendEmail(
      user.email,
      'Reset Your Password',
      mjmlTemplate,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (response.rejected.length > 0)
      throw new ForbiddenException('SMTP is reject sending message');
    return { message: 'Password reset link sent to your email' };
  }
  //reset password

  async sendVerificationEmail(otp: string, email: string) {
    const mjmlTemplate = emailVerificationTemplate(otp);
    await this.mailService.sendEmail(email, 'Email Verification', mjmlTemplate);
    return { message: 'Email sent successfully' };
  }

	async verifyEmail(email:string,otp: string): Promise<{ message: string }> {
    try {

			const user = await this.userModel.findOne({ email: email, is_verified: false, otp: otp });

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      await this.userModel.updateOne({ id: user.id },{ is_verified: true });

      return { message: 'Email Verified successfully' };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

	async resetPassword(token: string, newPassword: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decoded = this.jwtService.verify(token);
      const user = await this.userModel.findOne({ id: decoded.sub });
      if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
        console.log('check');
        throw new BadRequestException('Invalid or expired token');
      }

      // Check if token is expired
      if (new Date() > user.resetPasswordExpires) {
        throw new BadRequestException('Token has expired');
      }

      // Verify token with stored hashed token
      const isValid = await bcrypt.compare(user.resetPasswordToken, token);
      if (!isValid) {
        throw new BadRequestException('Invalid reset token');
      }

      const password = await bcrypt.hash(newPassword, 10);
      // Update password and clear token
      await this.userModel.updateOne({ id: user.id },{
          password,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        });

      return { message: 'Password successfully reset' };
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Invalid or expired token');
    }
  }
}
