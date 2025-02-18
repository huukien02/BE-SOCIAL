import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/users/user.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './comments.entity';
import { Blog } from 'src/blogs/blogs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Blog])],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
