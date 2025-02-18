import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './reaction.entity';
import { User } from 'src/users/user.entity';
import { Blog } from 'src/blogs/blogs.entity';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction) private reactionRepo: Repository<Reaction>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Blog) private blogRepo: Repository<Blog>,
  ) {}

  async reactToBlog(userId: number, blogId: number, type: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const blog = await this.blogRepo.findOne({ where: { id: blogId } });

    if (!user || !blog) {
      throw new Error('User hoặc Blog không tồn tại');
    }

    let reaction = await this.reactionRepo.findOneBy({
      user: { id: userId },
      blog: { id: blogId },
    });

    if (reaction) {
      reaction.type = type;
      return this.reactionRepo.save(reaction);
    }

    reaction = this.reactionRepo.create({ user, blog, type });
    return this.reactionRepo.save(reaction);
  }
}
