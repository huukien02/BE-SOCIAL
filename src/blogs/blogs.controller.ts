import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './DTO/create-blog.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @Body()
    createBlogDto: CreateBlogDto,
    @UploadedFile() image,
    @Request() req,
  ) {
    createBlogDto.image = image ? image : null;

    const data = await this.blogsService.createPost(createBlogDto, req.user);

    return {
      message: 'Tạo bài viết thành công',
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get()
  async getAll() {
    const data = await this.blogsService.findAll();
    return {
      message: 'Lấy thành công',
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
