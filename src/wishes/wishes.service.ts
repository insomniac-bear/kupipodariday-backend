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

export enum FindingWishesParam {
  ById = 'id',
  ByName = 'name',
  ByUserId = 'userId',
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

  findWishesByParam(paramName: FindingWishesParam, paramValue: string) {
    return this.wishRepository.find({
      where: {
        [paramName]: paramValue,
      },
    });
  }

  findLastWishes() {
    return this.wishRepository.find({
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
