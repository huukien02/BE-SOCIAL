import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // API gửi tin nhắn
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async sendMessage(
    @Body('senderId') senderId: number,
    @Body('receiverId') receiverId: number,
    @Body('conversationId') conversationId: number,
    @Body('content') content: string,
  ): Promise<Message> {
    return this.messageService.sendMessage(
      senderId,
      receiverId,
      conversationId,
      content,
    );
  }

  // @UseInterceptors(AnyFilesInterceptor())
  @UseGuards(JwtAuthGuard)
  @Get('/conversation/:conversationId')
  async getMessagesByConversation(
    @Param('conversationId') conversationId: number,
    @Request() req,
  ) {
    const user = req.user;
    const data = await this.messageService.getMessagesByConversation(
      user,
      conversationId,
    );

    return {
      message: 'Thành công',
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
