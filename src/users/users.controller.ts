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
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { FormatUserInterceptor } from 'src/interceptors/format-user.interceptor';
import { ServerException } from 'src/exceptions/server.exception';
import { ErrorCode } from 'src/exceptions/error-codes';

@UseInterceptors(FormatUserInterceptor)
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtGuard)
  @Get('/me')
  findMe(@Req() req) {
    return req.user;
  }

  // @UseGuards(JwtGuard)
  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new ServerException(ErrorCode.UserNotFound);
    }

    return user;
  }

  // @UseGuards(JwtGuard)
  @Patch('/me')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const { id } = req.user;
    return this.usersService.updateOne(+id, updateUserDto);
  }

  // @UseGuards(JwtGuard)
  @Post('find')
  async findMany(@Body('query') query: string) {
    return await this.usersService.findMany(query);
  }
}
