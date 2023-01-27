import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { FormatUserInterceptor } from 'src/interceptors/format-user.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(FormatUserInterceptor)
  @Get('/me')
  findMe(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(FormatUserInterceptor)
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(FormatUserInterceptor)
  @Patch('/me')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const { id } = req.user;
    return this.usersService.updateOne(+id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  // @UseInterceptors(FormatUserInterceptor)
  @Post('find')
  async findMany(@Body('query') query: string) {
    return await this.usersService.findMany(query);
  }
}
