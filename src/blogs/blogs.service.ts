import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blogs.entity';
import { saveFile } from 'src/common';
import { User } from 'src/users/user.entity';
import { CreateBlogDto } from './DTO/create-blog.dto';
import { BlogsGateway } from './blog.gateway';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogRepo: Repository<Blog>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private blogsGateway: BlogsGateway,
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
    // Gửi sự kiện WebSocket khi có bài viết mới
    const updatedBlogs = await this.findAll();
    this.blogsGateway.sendUpdatedBlogs(updatedBlogs);
  }

  async findAll() {
    return this.blogRepo.find({
      relations: [
        'user',
        'comments',
        'comments.user',
        'reactions',
        'reactions.user',
      ],
    });
  }

  async getMonthlyStatistics() {
    const blogData = await this.blogRepo
      .createQueryBuilder('blog')
      .select([
        "DATE_FORMAT(blog.created_at, '%m') AS month",
        'COUNT(blog.id) AS blogs',
      ])
      .groupBy("DATE_FORMAT(blog.created_at, '%m')")
      .getRawMany();

    const userData = await this.userRepo
      .createQueryBuilder('user')
      .select([
        "DATE_FORMAT(user.created_at, '%m') AS month",
        'COUNT(user.id) AS users',
      ])
      .groupBy("DATE_FORMAT(user.created_at, '%m')")
      .getRawMany();

    // Gộp dữ liệu từ hai bảng
    const monthNames = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ];

    const data = monthNames.map((month, index) => {
      const monthIndex = (index + 1).toString().padStart(2, '0'); // Định dạng '01', '02', ..., '12'
      const blogs = blogData.find((b) => b.month === monthIndex)?.blogs || 0;
      const users = userData.find((u) => u.month === monthIndex)?.users || 0;

      return {
        month,
        users: Number(users),
        blogs: Number(blogs),
      };
    });

    return data;
  }
}
