import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existing)
      return { data: 'User Already Exists', status: HttpStatus.BAD_REQUEST };

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        email: dto.email,
      },
    });

    const token = await this.generateToken({
      id: user.id,
      username: user.username,
    });
    return { data: { user, token }, status: HttpStatus.OK };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (!user)
      return { data: 'invalid credentials', status: HttpStatus.BAD_REQUEST };

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid)
      return { data: 'invalid credentials', status: HttpStatus.BAD_REQUEST };

    const token = await this.generateToken({
      id: user.id,
      username: user.username,
    });
    return { data: { user, token }, status: HttpStatus.OK };
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async generateToken(payload: { id: string; username: string }) {
    return await this.jwtService.signAsync(payload, { expiresIn: '7d' });
  }
}
