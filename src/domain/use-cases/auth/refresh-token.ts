import {
  JWT_REFRESH_TOKEN_EXPIREIN,
  JWT_REFRESH_TOKEN_SECRECT,
} from '@config/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { NotFoundError } from '@domain/value-objects/errors/not-found-error';

import { UsersRepository } from '@infra/database/repositories/users.repository';
import { AuthUser } from '@infra/http/auth/auth-user';

type UseCaseRefreshTokenRequest = {
  refreshToken: string;
};

type UseCaseRefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class UseCaseRefreshToken {
  constructor(
    private userRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}
  async execute({
    refreshToken: currentRefreshToken,
  }: UseCaseRefreshTokenRequest): Promise<UseCaseRefreshTokenResponse> {
    const payload = await this.jwtService.verifyAsync<AuthUser>(
      currentRefreshToken,
      {
        secret: JWT_REFRESH_TOKEN_SECRECT,
      },
    );

    if (!payload) throw new UnauthorizedException();

    const user = await this.userRepository.findById(payload?.sub);
    if (!user) throw new NotFoundError('user');

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        secret: JWT_REFRESH_TOKEN_SECRECT,
        expiresIn: JWT_REFRESH_TOKEN_EXPIREIN,
      },
    );

    return { accessToken, refreshToken };
  }
}
