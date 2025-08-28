import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../controllers/users.controller';
import { SessionsService } from '../services/sessions.service';
import { User } from '../validators/user.entity';
import { Session } from '../validators/session.entity';
import { UsersService } from '../services/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session])],
  controllers: [UsersController],
  providers: [UsersService, SessionsService, JwtService],
  exports: [UsersService, SessionsService],
})
export class UsersModule {}
