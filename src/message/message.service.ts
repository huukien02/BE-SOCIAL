// src/message/message.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/users/user.entity';
import { Conversation } from 'src/conversation/conversation.entity';
import { MessageGateway } from './message.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    private messageGateway: MessageGateway,
  ) {}

  async sendMessage(
    senderId: number,
    receiverId: number,
    conversationId: number,
    content: string,
  ): Promise<Message> {
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    const receiver = await this.userRepository.findOne({
      where: { id: receiverId },
    });
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!sender || !receiver || !conversation) {
      throw new Error('Sender, Receiver hoặc Conversation không tồn tại');
    }

    const message = this.messageRepository.create({
      content,
      sender,
      receiver,
      conversation,
    });

    const data = await this.messageRepository.save(message);
    this.messageGateway.sendMessage(conversationId);
    return data;
  }

  async getMessagesByConversation(
    user: any,
    conversationId: number,
  ): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      relations: ['sender', 'receiver', 'conversation'],
      order: { createdAt: 'ASC' },
    });
  }
}
