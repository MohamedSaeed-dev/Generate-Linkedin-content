import { IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;
}
