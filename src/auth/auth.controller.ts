import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from '../decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @Public()
  async signup(@Body() dto: SignupDto, @Res() res: Response) {
    const { status, data } = await this.authService.signup(dto);
    return res.status(status).json({ data });
  }

  @Post('login')
  @Public()
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { status, data } = await this.authService.login(dto);
    return res.status(status).json({ data });
  }

  @Get()
  @Public()
  async unsubscribe(@Query() userId: string ,@Res() res: Response) {
    const { status, data } = await this.authService.unsubscribe(userId);
    return res.status(status).json({ data });
  }
}
