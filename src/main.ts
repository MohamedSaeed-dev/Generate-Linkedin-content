import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt/jwt.guard';
import constants from './constants/config.constant';
import * as session from 'express-session';
import { HttpExceptionFilter } from './exceptions/http-exceptions.exception';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: constants.secret,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(app.get(WINSTON_MODULE_PROVIDER)));
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
