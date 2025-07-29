import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto{
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class VerifyEmailDto{
    @IsEmail()
    email: string;

    @IsString()
    otp: string;
}

export class ForgotPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}