import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { Reaction } from './reaction.entity';
import { User } from 'src/users/user.entity';
import { Blog } from 'src/blogs/blogs.entity';
import { BlogsGateway } from 'src/blogs/blog.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction, User, Blog])],
  controllers: [ReactionController],
  providers: [ReactionService, BlogsGateway],
})
export class ReactionModule {}
