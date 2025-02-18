import {
  IsOptional,
  IsString,
  IsIn,
  IsNotEmpty,
  MinLength,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString({ message: 'Tên người dùng phải là một chuỗi' })
  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  username: string;

  @IsString({ message: 'Mật khẩu phải là một chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @IsOptional()
  avatar: any;

  @IsString()
  @IsOptional()
  role: string;
}
