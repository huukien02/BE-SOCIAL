// src/message/message.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { Conversation } from 'src/conversation/conversation.entity';
import { User } from 'src/users/user.entity';
import { MessageController } from './message.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Conversation, User]),
    AuthModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
  exports: [MessageService],
})
export class MessageModule {}
