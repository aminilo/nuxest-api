import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  ['uploads', 'uploads/user-avatars', 'uploads/property-images'].forEach(dir => {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  });

  const app = await NestFactory.create(AppModule);
  app.use('/uploads', express.static(join(__dirname, '..', '..', 'uploads')));
  // app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.use(helmet());
  app.use(hpp());
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? 'https://nuxest.vercel.app' : 'http://localhost:3000',
    credentials: true
  });
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  }));

  app.use(cookieParser());
  if( process.env.NODE_ENV === 'production' ){
    app.use(csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
      }
    }));
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );

  const swaggerConfig = new DocumentBuilder().setTitle('东西 新开的').setDescription('这是各种的程序API').setVersion('1.0.0').addBearerAuth().build();

  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
