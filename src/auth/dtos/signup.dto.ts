import { IsEmail, IsString, Matches } from "class-validator";

export class SignupDto{
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#]{6,}$/, {
        message: 'Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one number.',
    })
    password: string;
}