import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }
  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ username: dto.username }, { email: dto.email }] },
    });
    if (existing)
      return { data: 'User Already Exists', status: HttpStatus.BAD_REQUEST };
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        email: dto.email,
        isSubscribed: !!dto.email
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
    if (dto.email) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isSubscribed: true, email: dto.email },
      });
    }
    ;
    return { data: { user, token }, status: HttpStatus.OK };
  }
  async unsubscribe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user)
      return { data: 'User not found', status: HttpStatus.NOT_FOUND };
    await this.prisma.user.update({
      where: { id: userId },
      data: { isSubscribed: false },
    });
    return { data: 'User unsubscribed successfully', status: HttpStatus.OK };
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
