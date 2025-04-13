import {IsString, IsOptional} from 'class-validator'
export class AskLlmDto {
    @IsString()
    @IsOptional()
    question?: string;
    @IsString()
    @IsOptional()
    session?:string
}
