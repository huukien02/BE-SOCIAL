import { UserToken } from 'src/access-token/user-token.entity';
import { Blog } from 'src/blogs/blogs.entity';
import { Conversation } from 'src/conversation/conversation.entity';
import { Message } from 'src/message/message.entity';
import { Reaction } from 'src/reaction/reaction.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';

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

  @ManyToMany(() => Conversation, (conversation) => conversation.participants)
  conversations: Conversation[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];
}
