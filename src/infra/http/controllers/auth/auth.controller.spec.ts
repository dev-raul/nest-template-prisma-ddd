import { JwtService } from '@nestjs/jwt';

import { EncryptorService } from '@domain/services/encryptor/encriptor.service';
import { UseCaseCreateSignIn } from '@domain/use-cases/auth/create-signin';
import { UseCaseRefreshToken } from '@domain/use-cases/auth/refresh-token';
import { UseCaseGetUserById } from '@domain/use-cases/user/get-user-by-id';

import { PrismaService } from '@infra/database/prisma/prisma.service';
import { PrismaUsersRepository } from '@infra/database/prisma/repositories/prisma-users-repository';
import { UsersRepository } from '@infra/database/repositories/users.repository';
import { BcryptEncryptorService } from '@infra/http/services/encryptor/bcrypt-encriptor-service';
import { UserViewModel } from '@infra/http/view-models/user-view-model';
import { makeFakeUser } from '@test/factories/users.factory';



import { AuthController } from './auth.controller';

describe('AuthController', () => {
  //Services
  let prisma: PrismaService;
  let userRepository: UsersRepository;
  let encryptorService: EncryptorService;
  let jwtService: JwtService;

  // UseCase
  let useCaseCreateSignIn: UseCaseCreateSignIn;
  let useCaseRefreshToken: UseCaseRefreshToken;
  let useCaseGetByIdUser: UseCaseGetUserById;

  //Controller
  let authController: AuthController;

  const user = makeFakeUser({}, 1);

  beforeEach(async () => {
    //Services
    prisma = new PrismaService();
    userRepository = new PrismaUsersRepository(prisma);
    encryptorService = new BcryptEncryptorService();

    //UseCase
    useCaseGetByIdUser = new UseCaseGetUserById(userRepository);
    useCaseCreateSignIn = new UseCaseCreateSignIn(
      userRepository,
      encryptorService,
      jwtService,
    );
    useCaseRefreshToken = new UseCaseRefreshToken(userRepository, jwtService);

    //Controller
    authController = new AuthController(
      useCaseCreateSignIn,
      useCaseRefreshToken,
      useCaseGetByIdUser,
    );
  });

  describe('root', () => {
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
  });
});
