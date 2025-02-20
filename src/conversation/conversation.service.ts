// src/conversation/conversation.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createOrGetConversation(
    userId1: number,
    userId2: number,
  ): Promise<Conversation> {
    if (userId1 === userId2) {
      throw new Error('Không thể tạo cuộc trò chuyện với chính mình');
    }

    // // Kiểm tra nếu cuộc trò chuyện giữa 2 user đã tồn tại
    const existingConversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participant')
      .where('participant.id IN (:...ids)', { ids: [userId1, userId2] })
      .groupBy('conversation.id')
      .having('COUNT(participant.id) = 2')
      .getOne();

    if (existingConversation) {
      return existingConversation;
    }

    // Tạo cuộc trò chuyện mới nếu chưa tồn tại
    const user1 = await this.userRepository.findOne({ where: { id: userId1 } });
    const user2 = await this.userRepository.findOne({ where: { id: userId2 } });

    if (!user1 || !user2) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const conversation = this.conversationRepository.create({
      participants: [user1, user2],
    });

    return this.conversationRepository.save(conversation);
  }

  async getUserConversations(userId: number): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: { participants: { id: userId } },
      relations: ['participants', 'messages'],
    });
  }
}
