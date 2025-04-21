import { IsOptional, IsString } from 'class-validator';
export class AskLlmDto {
  @IsString()
  question: string;
  @IsString()
  chatId: string;
  @IsString()
  @IsOptional()
  session: string;
}
