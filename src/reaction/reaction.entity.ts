import { Blog } from 'src/blogs/blogs.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reactions, { eager: true })
  user: User;

  @ManyToOne(() => Blog, (blog) => blog.reactions, { eager: true })
  blog: Blog;

  @Column()
  type: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
