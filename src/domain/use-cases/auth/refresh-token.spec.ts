import { JWT_REFRESH_TOKEN_SECRECT } from '@config/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { NotFoundError } from '@domain/value-objects/errors/not-found-error';

import { UsersRepository } from '@infra/database/repositories/users.repository';

import { makeFakeUser } from '@test/factories/users.factory';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository';

import { UseCaseRefreshToken } from './refresh-token';

describe('UseCaseRefreshToken', () => {
  let useCaseRefreshToken: UseCaseRefreshToken;
  let userRepository: UsersRepository;
  let jwtService: JwtService;

  const user = makeFakeUser({}, 1);
  const dataToken = {
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
  };

  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository();
    jwtService = new JwtService();
    useCaseRefreshToken = new UseCaseRefreshToken(userRepository, jwtService);
  });

  it('should error to invalid refresh token', async () => {
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(null);
    await expect(
      useCaseRefreshToken.execute({
        refreshToken: 'CURRENT_REFRESH_TOKEN',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should error to not found user', async () => {
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: user.id });
    jest.spyOn(userRepository, 'findById').mockResolvedValue(undefined);
    await expect(
      useCaseRefreshToken.execute({
        refreshToken: 'CURRENT_REFRESH_TOKEN',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should refresh token', async () => {
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: user.id });
    jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
    jest
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValueOnce(dataToken.accessToken)
      .mockResolvedValue(dataToken.refreshToken);

    expect(
      await useCaseRefreshToken.execute({
        refreshToken: 'CURRENT_REFRESH_TOKEN',
      }),
    ).toEqual(dataToken);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith(
      'CURRENT_REFRESH_TOKEN',
      {
        secret: JWT_REFRESH_TOKEN_SECRECT,
      },
    );
    expect(userRepository.findById).toHaveBeenCalledWith(user.id);
  });
});
