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
  UseInterceptors,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { FormatWishInterceptor } from 'src/interceptors/format-wish.interceptor';

@UseGuards(JwtGuard)
@UseInterceptors(FormatWishInterceptor)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    const { user } = req;
    return this.wishlistsService.create(user, createWishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOneById(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const userId = req.user.id;
    return this.wishlistsService.update(Number(id), updateWishlistDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.wishlistsService.remove(Number(id), userId);
  }
}
