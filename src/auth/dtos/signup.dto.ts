import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, Matches } from "class-validator";
import { UserRole } from "src/user/user.model";

export class SignupDto {
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;

  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&#]{6,}$/, {
    message:
      'Password must be at least 6 characters long and include both letters and numbers. Symbols are optional.',
  })
  password: string;
  @IsOptional()
  @IsPhoneNumber('ET', {
    message: 'Phone number must be a valid Ethiopian phone number.',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  // @IsOptional()
  // @IsEnum(UserRole, { message: 'Role must be either ADMIN or CUSTOMER.' } )
  // role?: UserRole = UserRole.CUSTOMER; // Default to CUSTOMER if not provided
}