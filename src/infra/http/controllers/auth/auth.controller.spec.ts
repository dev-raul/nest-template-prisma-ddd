import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { UseCaseCreateSignIn } from '@domain/use-cases/auth/create-signin';
import { UseCaseRefreshToken } from '@domain/use-cases/auth/refresh-token';
import { UseCaseGetUserById } from '@domain/use-cases/user/get-user-by-id';

import { DatabaseModule } from '@infra/database/database.module';
import { ServicesModule } from '@infra/http/services/services';
import { UserViewModel } from '@infra/http/view-models/user-view-model';

import { makeFakeUser } from '@test/factories/users.factory';

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let useCaseCreateSignIn: UseCaseCreateSignIn;
  let useCaseRefreshToken: UseCaseRefreshToken;
  let useCaseGetUserById: UseCaseGetUserById;

  let authController: AuthController;

  const user = makeFakeUser({}, 1);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule, ServicesModule],
      controllers: [AuthController],
      providers: [
        UseCaseCreateSignIn,
        UseCaseRefreshToken,
        UseCaseGetUserById,
        JwtService,
      ],
    }).compile();

    useCaseCreateSignIn =
      moduleRef.get<UseCaseCreateSignIn>(UseCaseCreateSignIn);
    useCaseRefreshToken =
      moduleRef.get<UseCaseRefreshToken>(UseCaseRefreshToken);
    useCaseGetUserById = moduleRef.get<UseCaseGetUserById>(UseCaseGetUserById);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  it('should create signin', async () => {
    const tokenData = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
    jest.spyOn(useCaseCreateSignIn, 'execute').mockResolvedValue(tokenData);

    expect(
      await authController.signIn({
        email: user.email,
        password: user.password,
      }),
    ).toEqual(tokenData);
  });

  it('should refresh token', async () => {
    const tokenData = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
    jest.spyOn(useCaseRefreshToken, 'execute').mockResolvedValue(tokenData);

    expect(
      await authController.refreshToken({
        refreshToken: tokenData?.refreshToken,
      }),
    ).toEqual(tokenData);
  });

  it('should get profile', async () => {
    jest.spyOn(useCaseGetUserById, 'execute').mockResolvedValue(user);

    expect(
      await authController.getProfile({
        user: {
          sub: user?.id,
          exp: 0,
          iat: 0,
        },
      }),
    ).toEqual(UserViewModel.toHttp(user));
  });
});
