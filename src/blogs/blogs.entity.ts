import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Comment } from 'src/comments/comments.entity';
import { Reaction } from 'src/reaction/reaction.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'int', default: 0 })
  feel: number;

  @ManyToOne(() => User, (user) => user.blogs, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Reaction, (reaction) => reaction.blog)
  reactions: Reaction[];

  @OneToMany(() => Comment, (comment) => comment.blog, { cascade: true })
  comments: Comment[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
