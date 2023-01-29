import { IsString, IsUrl } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 250,
  })
  @IsString()
  name: string;

  @Column({
    type: 'varchar',
    length: 1500,
  })
  @IsString()
  description: string;

  @Column({
    type: 'varchar',
  })
  @IsUrl()
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.wishlist)
  user: User;

  @OneToMany(() => Wish, (wish) => wish.items)
  wishId: Wish;
}