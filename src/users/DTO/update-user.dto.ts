import { IsOptional, IsString, MinLength, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'Tên người dùng phải là một chuỗi' })
  @IsOptional()
  username?: string;

  @IsString({ message: 'Mật khẩu phải là một chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsOptional()
  password?: string;

  @IsOptional()
  avatar?: any;
}
