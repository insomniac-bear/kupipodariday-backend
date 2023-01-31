import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    const { id } = req.user;
    return this.wishesService.create(id, createWishDto);
  }

  @Get('/last')
  findLastWishes() {
    return this.wishesService.findLastWishes();
  }

  @Get('/top')
  findTopWishes() {
    return this.wishesService.findTopWishes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(Number(id));
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const userId = req.user.id;
    return this.wishesService.update(Number(id), Number(userId), updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.wishesService.remove(Number(id), Number(userId));
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.wishesService.copyWish(Number(id), Number(userId));
  }
}
