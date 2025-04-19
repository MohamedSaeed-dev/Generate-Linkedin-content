import { IsOptional, IsString } from 'class-validator';

export class SignupDto {
  @IsString()
  username: string;
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  email: string;
}
