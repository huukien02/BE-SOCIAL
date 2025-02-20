// src/conversation/conversation.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, User])],
  providers: [ConversationService],
  controllers: [ConversationController],
})
export class ConversationModule {}
