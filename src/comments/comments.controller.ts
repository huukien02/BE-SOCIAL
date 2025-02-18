import {
  Controller,
  Post,
  Body,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './DTO/create-comments.dto';
import { ApiResponse } from 'src/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async createComment(@Body() createCommentDto): Promise<ApiResponse> {
    const data = await this.commentsService.createComment(createCommentDto);
    return {
      message: 'Bình luận thành công',
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
