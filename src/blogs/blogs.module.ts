import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { Blog } from './blogs.entity';
import { User } from 'src/users/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { BlogsGateway } from './blog.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, User]), AuthModule],
  providers: [BlogsService, BlogsGateway],
  controllers: [BlogsController],
})
export class BlogsModule {}
