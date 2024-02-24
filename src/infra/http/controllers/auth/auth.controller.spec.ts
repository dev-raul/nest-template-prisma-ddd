import { JwtService } from '@nestjs/jwt';

import { EncryptorService } from '@domain/services/encryptor/encriptor.service';
import { UseCaseCreateSignIn } from '@domain/use-cases/auth/create-signin';
import { UseCaseRefreshToken } from '@domain/use-cases/auth/refresh-token';
import { UseCaseGetUserById } from '@domain/use-cases/user/get-user-by-id';

import { UsersRepository } from '@infra/database/repositories/users.repository';
import { BcryptEncryptorService } from '@infra/http/services/encryptor/bcrypt-encriptor-service';
import { UserViewModel } from '@infra/http/view-models/user-view-model';

import { makeFakeUser } from '@test/factories/users.factory';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository';

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let useCaseCreateSignIn: UseCaseCreateSignIn;
  let useCaseGetUserById: UseCaseGetUserById;
  let useCaseRefreshToken: UseCaseRefreshToken;

  let userRepository: UsersRepository;

  let jwtService: JwtService;
  let encryptorService: EncryptorService;

  let authController: AuthController;

  const user = makeFakeUser({}, 1);

  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository();
    encryptorService = new BcryptEncryptorService();
    useCaseCreateSignIn = new UseCaseCreateSignIn(
      userRepository,
      encryptorService,
      jwtService,
    );
    useCaseRefreshToken = new UseCaseRefreshToken(userRepository, jwtService);
    useCaseGetUserById = new UseCaseGetUserById(userRepository);
    authController = new AuthController(
      useCaseCreateSignIn,
      useCaseRefreshToken,
      useCaseGetUserById,
    );
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
