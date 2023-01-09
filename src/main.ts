import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session'
import { TypeormStore } from 'connect-typeorm'
import { DataSource } from 'typeorm';
import { SessionEntity } from './session.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1')

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  const sessionRepository = app.get(DataSource).getRepository(SessionEntity)
  app.use(session({
    name : 'chat_session_id',
    secret: 'M%wx#pG!lj5u4vRS7KB&C6IQo@1,e0)ui2o(r3a_d8+n',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge : 60000 
    },
    store: new TypeormStore({
      cleanupLimit : 10
    }).connect(sessionRepository)
  }))

  await app.listen(3000);
}
bootstrap();
