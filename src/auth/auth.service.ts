import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'src/access-token/user-token.entity';
import { dateTimeExpire } from 'src/common';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const { username, id, email, role, avatar } = user;
    const payload = { username, id, email, role, avatar };

    const token = this.jwtService.sign(payload);

    const userToken = this.userTokenRepository.create({
      token,
      user,
      expired_at: dateTimeExpire(),
      is_blacklisted: false,
    });

    await this.userTokenRepository.save(userToken);

    return token;
  }

  async logout(token: string): Promise<UserToken> {
    const userToken = await this.userTokenRepository.findOne({
      where: { token, is_blacklisted: false },
    });

    if (!userToken) {
      throw new HttpException('Token không tồn tại', HttpStatus.NOT_FOUND);
    }

    userToken.is_blacklisted = true;
    await this.userTokenRepository.save(userToken);
    return userToken;
  }

  async getProfile(userId: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'blogs',
        'blogs.user',
        'blogs.comments',
        'blogs.comments.user',
        'blogs.reactions',
        'blogs.reactions.user',
      ],
    });
  }
}
