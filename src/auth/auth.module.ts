import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports : [UsersService],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    {
      provide: 'users_service',
      useClass : UsersService
    }
  ]
})
export class AuthModule {}
