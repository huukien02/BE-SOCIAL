import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blogs.entity';
import { saveFile } from 'src/common';
import { User } from 'src/users/user.entity';
import { CreateBlogDto } from './DTO/create-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogRepo: Repository<Blog>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createPost(blog: CreateBlogDto, userLogger: User) {
    const user = await this.userRepo.findOne({
      where: { id: blog.userId },
    });

    if (!user) {
      throw new Error('User không tồn tại');
    }

    if (userLogger.id !== user.id) {
      throw new Error('User không hợp lệ');
    }

    const newBlog = new Blog();

    newBlog.title = blog.title;
    newBlog.content = blog.content;
    newBlog.image = blog.image ? saveFile(blog.image, 'blogs') : null;
    newBlog.feel = blog.feel;
    newBlog.user = user;

    await this.blogRepo.save(newBlog);
  }

  async findAll() {
    const blogs = await this.blogRepo.find({
      relations: [
        'user',
        'comments',
        'comments.user',
        'reactions',
        'reactions.user',
      ],
    });
    return blogs;
  }
}
