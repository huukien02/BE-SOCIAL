import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
  Get,
  Request,
  ValidationPipe,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { ApiResponse } from 'src/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseInterceptors(AnyFilesInterceptor())
  async login(@Body() loginDto: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu');
    }

    const access_token = await this.authService.login(user);

    return {
      message: 'Đăng nhập thành công',
      statusCode: HttpStatus.OK,
      data: access_token,
    };
  }

  //   @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body('token') token: string): Promise<ApiResponse> {
    const data = await this.authService.logout(token);
    return {
      message: 'Đăng xuất thành công',
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<ApiResponse> {
    const user = req.user;
    const data = await this.authService.getProfile(user.id);

    return {
      message: 'Thành công',
      statusCode: HttpStatus.OK,
      data: data,
    };
  }
}
