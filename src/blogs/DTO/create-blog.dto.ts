import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  userId: any;

  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  image: any;

  @IsOptional()
  feel?: any;
}
