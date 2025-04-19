import { IsString, IsOptional } from 'class-validator';
export class AskLlmDto {
  @IsString()
  question: string;
  @IsString()
  @IsOptional()
  session: string;
}
