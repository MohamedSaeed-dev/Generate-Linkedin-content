import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../decorators/public.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
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
}
