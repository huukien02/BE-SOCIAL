import { UserToken } from 'src/access-token/user-token.entity';
import { Blog } from 'src/blogs/blogs.entity';
import { Reaction } from 'src/reaction/reaction.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToMany(() => UserToken, (userToken) => userToken.user)
  tokens: UserToken[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @OneToMany(() => Blog, (blog) => blog.user, { cascade: true })
  blogs: Blog[];
  comments: any;
}
