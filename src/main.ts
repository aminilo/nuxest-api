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
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(hpp());
  app.use(cookieParser());

  app.enableCors({ /* so the preflight allows everything frontend needs */
    origin: process.env.NODE_ENV === 'production'
      ? 'https://nuxest.vercel.app'
      : 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'x-csrf-token'],
    exposedHeaders: ['set-cookie'],
  });

  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

  if( process.env.NODE_ENV === 'production' ){
    app.use(csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'None',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
      },
      value: req => req.headers['x-csrf-token'] as string
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

  ['uploads', 'uploads/user-avatars', 'uploads/property-images'].forEach(dir=> { if (!existsSync(dir)) mkdirSync(dir, { recursive: true }); });
  app.use('/uploads', express.static(join(__dirname, '..', '..', 'uploads')));

  const swaggerConfig = new DocumentBuilder().setTitle('东西 新开的').setDescription('这是各种的程序API').setVersion('1.0.0').addBearerAuth().build();

  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
