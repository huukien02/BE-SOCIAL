import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'src/access-token/user-token.entity';
import { AUTH_SECCET_KEY } from 'src/common';
import { Repository } from 'typeorm';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) return false;

    const userToken = await this.userTokenRepository.findOne({
      where: { token, is_blacklisted: false },
    });

    if (!userToken || new Date() >= userToken.expired_at) return false;

    try {
      const payload = this.jwtService.verify(token, {
        secret: AUTH_SECCET_KEY,
      });

      request.user = payload;
      return true;
    } catch (error) {
      return false;
    }
  }
}
