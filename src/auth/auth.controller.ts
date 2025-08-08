import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { ForgotPasswordDTO, LoginDto, ResetPasswordDto, VerifyEmailDto } from './dtos/login.dto';
import { GoogleAuthGuard } from 'src/gurads/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // post signup
  @Post('signup')
  async signup(@Body() signUpData: SignupDto) {
    return this.authService.signup(signUpData);
  }

  // post login
  @Post('login')
  async login(@Body() LoginData: LoginDto) {
    return this.authService.login(LoginData);
  }
  // post Forgot Password
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDTO) {
    return this.authService.forgotPassword(dto.email);
  }
  // post Reset Password
  @Post('reset-password')
 async resetPassword(@Body() dto: ResetPasswordDto)
   {
    const { token, password } = dto;
    return this.authService.resetPassword(token, password);
  }

  // post Verify Email
  @Post('verify-email')
  async verifyEmail(@Body() VerifyData: VerifyEmailDto) {
    try {
      return await this.authService.verifyEmail(
        VerifyData.email,
        VerifyData.otp,
      );
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Unable to verify');
    }
  }
  // post Social Login
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    // this.authService.config.get<string>('FRONTEND_URL')
    const response = await this.authService.generateUserToken(
      req.user._id,
      req.user.role,
    );
    res.redirect(
      `${process.env.FRONTEND_URL!}/auth/google/callback?token=${response.accessToken}`,
    );
  }

  // post Social Signup
}
