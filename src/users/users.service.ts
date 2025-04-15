import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async subscribe(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser && existingUser.deletedAt !== null) {
      return await this.prisma.user.update({
        where: { id: existingUser.id },
        data: { deletedAt: null },
      });
    }

    if (!existingUser) {
      return await this.prisma.user.create({
        data: {
          email: createUserDto.email,
        },
      });
    }
    return {message: "subscribed successfully"}
  }

  async unsubscribe(id: string) {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return {message: "unsubscribed successfully"}
  }
}
