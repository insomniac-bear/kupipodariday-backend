import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ServerExceptionFilter } from './filters/server-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ServerException } from './exceptions/server.exception';
import { ErrorCode } from './exceptions/error-codes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: () => new ServerException(ErrorCode.ValidationError),
    }),
  );

  app.enableCors();
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(helmet());
  app.useGlobalFilters(new ServerExceptionFilter());

  await app.listen(3001);
}
bootstrap();
