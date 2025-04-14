import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  subscribe(@Body() createUserDto: CreateUserDto) {
    return this.usersService.subscribe(createUserDto);
  }

  @Get(':id/unsubscribe')
  unsubscribe(@Param('id') id: string) {
    return this.usersService.unsubscribe(id);
  }
}
