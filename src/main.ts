import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
// import * as csurf from 'csurf';
import { AppModule } from './app.module';
import { ServerExceptionFilter } from './filters/server-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(helmet());
  app.useGlobalFilters(new ServerExceptionFilter());
  // app.use(csurf());

  await app.listen(3001);
}
bootstrap();
