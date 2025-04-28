import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SignupDto {
  @IsString()
  username: string;
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;
}
