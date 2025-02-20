// src/user/user.controller.ts

import {
  Controller,
  Post,
  Body,
  Get,
  ValidationPipe,
  UsePipes,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './DTO/create-user.dto';
import { ApiResponse } from 'src/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './DTO/update-user.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() avatar,
  ): Promise<ApiResponse> {
    createUserDto.avatar = avatar ? avatar : null;
    const data = await this.userService.create(createUserDto);

    return {
      message: 'Tạo thành công',
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  @Patch('update/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar,
  ) {
    updateUserDto.avatar = avatar ? avatar : null;
    const data = await this.userService.update(id, updateUserDto);
    return {
      message: 'Cập nhật thành công',
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('friends')
  async getFriend(@Request() req): Promise<ApiResponse> {
    const user = req.user;

    const data = await this.userService.getFriends(user.id);
    return {
      message: 'Thành công',
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
