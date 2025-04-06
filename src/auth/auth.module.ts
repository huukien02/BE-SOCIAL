import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AUTH_SECRET_KEY, TIME_EXPIRE } from 'src/common';
import { JwtAuthGuard } from './auth.guard';
import { UserToken } from 'src/access-token/user-token.entity';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, UserToken]),
    JwtModule.register({
      secret: AUTH_SECRET_KEY,
      signOptions: { expiresIn: TIME_EXPIRE },
    }),
  ],
  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtModule, TypeOrmModule],
})
export class AuthModule {}
