import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { CommentsModule } from './comments/comments.module';
import { ReactionModule } from './reaction/reaction.module';
import { BlogsGateway } from './blogs/blog.gateway';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    // ConfigurationModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'database-v1',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'images/avatar'),
        serveRoot: '/images/avatar',
      },
      {
        rootPath: join(__dirname, '..', 'images/blogs'),
        serveRoot: '/images/blogs',
      },
    ),

    TypeOrmModule.forFeature([]),
    BlogsModule,
    ReactionModule,
    CommentsModule,
    UserModule,
    AuthModule,
    ConversationModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, BlogsGateway],
})
export class AppModule {}
