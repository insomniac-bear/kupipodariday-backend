import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database/database.service';
import configuration from './config/configuration';
import { WinstonModule } from 'nest-winston';
import { ThrottlerModule } from '@nestjs/throttler';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      levels: {
        critical_error: 0,
        error: 1,
        special_warning: 2,
        another_log_level: 3,
        info: 4,
      },
      transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
      ],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
      inject: [DatabaseService],
    }),
  ],
  controllers: [],
  providers: [DatabaseService],
})
export class AppModule {}
