import { IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  email: string;
}
