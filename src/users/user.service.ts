// src/user/user.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './DTO/create-user.dto';
import { ROLE, saveFile } from 'src/common';
import { UpdateUserDto } from './DTO/update-user.dto';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, username, avatar } = createUserDto;

    const userExists = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (userExists) {
      throw new HttpException(
        'Email hoặc Username đã tồn tại',
        HttpStatus.CONFLICT,
      );
    }

    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(password, salt);

    createUserDto.avatar = avatar ? saveFile(avatar, 'avatar') : null;

    createUserDto.role = createUserDto.role || ROLE.USER;

    return this.userRepository.save(this.userRepository.create(createUserDto));
  }

  async update(id: any, updateUserDto: UpdateUserDto): Promise<User> {
    const { avatar } = updateUserDto;

    const user = await this.userRepository.findOne({
      where: [{ id }],
    });

    if (!user) {
      throw new HttpException('Tài khoản không tồn tại', HttpStatus.NOT_FOUND);
    }

    updateUserDto.avatar = avatar ? saveFile(avatar, 'avatar') : user.avatar;

    await this.userRepository.update(id, updateUserDto);

    return this.userRepository.findOne({ where: [{ id }] });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
