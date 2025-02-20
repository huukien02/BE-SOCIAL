// src/conversation/conversation.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.entity';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async createConversation(
    @Body('userId1') userId1: number,
    @Body('userId2') userId2: number,
  ): Promise<Conversation> {
    return this.conversationService.createOrGetConversation(userId1, userId2);
  }

  @Get(':userId')
  async getUserConversations(
    @Param('userId') userId: number,
  ): Promise<Conversation[]> {
    return this.conversationService.getUserConversations(userId);
  }
}
