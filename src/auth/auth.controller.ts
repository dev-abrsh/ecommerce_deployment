import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
        // post signup
        @Post('signup')
        async signup(@Body() SignUpData: SignupDto) {
            return this.authService.signup(SignUpData);
        }



        // post login
        @Post('login')
        async login(@Body() LoginData: LoginDto) {
            return this.authService.login(LoginData);
        }


        // post Refresh Token

        // post Logout

        // post Forgot Password
        // post Reset Password
        // post Change Password
        // post Verify Email
        // post Resend Verification Email
        // post Social Login
        // post Social Signup
    
}
