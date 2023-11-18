import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cors({
      origin: ['http://localhost:3001/'],
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      allowedHeaders: ['Content-Type', 'Authorization'], // Add any other headers you need
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app
    .listen(3000)
    .then(() => {
      console.log('successfully stared on port 3000');
    })
    .catch((error) => {
      console.log(error);
    });
}
bootstrap();
