import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { Message } from './messages/entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/user.entity';
import { AuthModule } from './auth/auth.module';
import { SessionEntity } from './session.entity';

@Module({
  imports: [
  MessagesModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities : [ Message, User, SessionEntity ],
      synchronize: true,
    }),
    AuthModule
  ],
})
export class AppModule {}
