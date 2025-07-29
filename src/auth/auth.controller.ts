import { Body, Controller, ForbiddenException, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { ForgotPasswordDTO, LoginDto, VerifyEmailDto } from './dtos/login.dto';

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
        // post Forgot Password
        @Post('forgot-password')
        async forgotPassword(@Body() dto: ForgotPasswordDTO) {
            return this.authService.forgotPassword(dto.email);
        }
        // post Reset Password
        @Post('reset-password')
        async resetPassword(
            @Query('token') token: string,
            @Body('password') password: string,
        ) {
            return this.authService.resetPassword(token, password);
        }

        // post Verify Email
        @Post('verify-email')
        async verifyEmail(@Body() VerifyData: VerifyEmailDto) {
            try {
            return await this.authService.verifyEmail(VerifyData.email, VerifyData.otp);
            } catch (error) {
            console.log(error);
            throw new ForbiddenException('Unable to verify');
            }
        }
        // post Social Login
        // post Social Signup
        
}
