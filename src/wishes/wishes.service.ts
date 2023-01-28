import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';

export enum TypeOfGetWish {
  Last = 'Last',
  Top = 'Top',
}

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  create(id: string, createWishDto: CreateWishDto) {
    const wish = this.wishRepository.save({
      ...createWishDto,
    });
    return wish;
  }

  findLastWishes() {
    return this.wishRepository.find({
      relations: {
        users: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} wish`;
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return `This action updates a #${id} wish`;
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}
