import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from '../decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('auth/signup')
  @Public()
  async signup(@Body() dto: SignupDto, @Res() res: Response) {
    const { status, data } = await this.authService.signup(dto);
    return res.status(status).json({ data });
  }

  @Post('auth/login')
  @Public()
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { status, data } = await this.authService.login(dto);
    return res.status(status).json({ data });
  }

  @Get('users/:userId/unsubscribe')
  @Public()
  async unsubscribe(@Param('userId') userId: string ,@Res() res: Response) {
    const { status, data } = await this.authService.unsubscribe(userId);
    return res.status(status).json({ data });
  }
}
