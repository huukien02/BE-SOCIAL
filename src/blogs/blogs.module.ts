import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { Blog } from './blogs.entity';
import { User } from 'src/users/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, User]), AuthModule],
  providers: [BlogsService],
  controllers: [BlogsController],
})
export class BlogsModule {}
