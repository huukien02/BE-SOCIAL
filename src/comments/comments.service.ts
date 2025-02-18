import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/user.entity';
import { Blog } from 'src/blogs/blogs.entity';
import { CreateCommentDto } from './DTO/create-comments.dto';
import { Comment } from './comments.entity';
import { BlogsGateway } from 'src/blogs/blog.gateway';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private blogsGateway: BlogsGateway,
  ) {}

  async createComment(createCommentDto: CreateCommentDto) {
    const { content, blogId, userId } = createCommentDto;

    if (!content || !blogId || !userId) {
      throw new Error('Thư trọng khóa');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const blog = await this.blogRepository.findOne({
      where: { id: blogId },
    });

    if (!user || !blog) {
      throw new Error('Tài khoản hoặc bài viết không tồn tại');
    }

    const newComment = new Comment();

    newComment.user = user;
    newComment.content = content;
    newComment.blog = blog;

    await this.commentRepository.save(newComment);
    this.blogsGateway.sendUpdatedComments(blogId, blog.comments);
  }
}
