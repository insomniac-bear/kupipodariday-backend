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
import { WishesService } from 'src/wishes/wishes.service';

@UseInterceptors(FormatUserInterceptor)
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get('/me')
  findMe(@Req() req) {
    return req.user;
  }

  @Patch('/me')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const { id } = req.user;
    return this.usersService.updateOne(+id, updateUserDto);
  }

  @Get('/me/wishes')
  async findMeWishes(@Req() req) {
    const { id } = req.user;

    return this.wishesService.findUsersWishes(id);
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new ServerException(ErrorCode.UserNotFound);
    }

    return user;
  }

  @Get(':username/wishes')
  async findUsersWishes(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new ServerException(ErrorCode.UserNotFound);
    }

    return this.wishesService.findUsersWishes(user.id);
  }

  @Post('find')
  async findMany(@Body('query') query: string) {
    return await this.usersService.findMany(query);
  }
}
