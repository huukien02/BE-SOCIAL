import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async react(@Body() body: { userId: number; blogId: number; type: number }) {
    const data = await this.reactionService.reactToBlog(
      body.userId,
      body.blogId,
      body.type,
    );
    return {
      message: 'Reaction thành công',
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
