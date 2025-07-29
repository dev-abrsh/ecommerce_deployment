import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.model';
import { Model } from 'mongoose';
import * as bcrypt from "bcrypt"
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ) {}
    async signup(signupData: SignupDto) {
        const {name, email, password} = signupData

        //check if the email exists
        const existingEmail = await this.userModel.findOne({ email: email });
        if (existingEmail) {
            throw new BadRequestException('Email already exists');
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password,10)

        // create userModel and save in mongodb

         await this.userModel.create({
            name: name,
            email: email,
            password: hashedPassword    
        }); 

    }
    async login(LoginData: LoginDto) {

        const {email, password} = LoginData
        // check if the user exists
        const user = await this.userModel.findOne({ email: email });
        if (!user) { 
            throw new UnauthorizedException("Wrong credentials")
        }

        // check if the password is correct
         const passwordMatch = await bcrypt.compare(password, user.password)
         if (!passwordMatch) {
            throw new UnauthorizedException("Wrong credentials")
         }

         // Generate JWT token 

         return this.generateUserToken(user._id)

    }
    async generateUserToken(userId) {
        const accessToken = this.jwtService.sign({userId});

        return {accessToken}
    }
    
    //refresh token

    //forgot password

    //reset password

}