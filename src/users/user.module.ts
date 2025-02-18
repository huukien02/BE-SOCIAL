import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserToken } from 'src/access-token/user-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserToken]), AuthModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
