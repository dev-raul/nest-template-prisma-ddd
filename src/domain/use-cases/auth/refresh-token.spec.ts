import { JWT_REFRESH_TOKEN_SECRECT, jwtConfig } from '@config/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { NotFoundError } from '@domain/value-objects/errors/not-found-error';

import { DatabaseModule } from '@infra/database/database.module';
import { UsersRepository } from '@infra/database/repositories/users.repository';
import { ServicesModule } from '@infra/http/services/services';

import { makeFakeUser } from '@test/factories/users.factory';

import { UseCaseRefreshToken } from './refresh-token';
import { UseCaseAuthModule } from './usecase-auth.module';

describe('UseCaseRefreshToken', () => {
  let useCaseCreateSignIn: UseCaseRefreshToken;
  let userRepository: UsersRepository;
  let jwtService: JwtService;

  const user = makeFakeUser({}, 1);
  const dataToken = {
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        ServicesModule,
        JwtModule.register(jwtConfig),
        UseCaseAuthModule,
      ],
    }).compile();

    useCaseCreateSignIn =
      moduleRef.get<UseCaseRefreshToken>(UseCaseRefreshToken);
    userRepository = moduleRef.get<UsersRepository>(UsersRepository);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it('should error to invalid refresh token', async () => {
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(null);
    await expect(
      useCaseCreateSignIn.execute({
        refreshToken: 'CURRENT_REFRESH_TOKEN',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should error to not found user', async () => {
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: user.id });
    jest.spyOn(userRepository, 'findById').mockResolvedValue(undefined);
    await expect(
      useCaseCreateSignIn.execute({
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
      await useCaseCreateSignIn.execute({
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
