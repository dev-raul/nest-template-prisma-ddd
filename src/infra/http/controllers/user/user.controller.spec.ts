import { EncryptorService } from '@domain/services/encryptor/encriptor.service';
import { UseCaseCreateUser } from '@domain/use-cases/user/create-user';

import { PrismaService } from '@infra/database/prisma/prisma.service';
import { PrismaUsersRepository } from '@infra/database/prisma/repositories/prisma-users-repository';
import { UsersRepository } from '@infra/database/repositories/users.repository';
import { BcryptEncryptorService } from '@infra/http/services/encryptor/bcrypt-encriptor-service';
import { UserViewModel } from '@infra/http/view-models/user-view-model';

import { makeFakeUser } from '@test/factories/users.factory';

import { UserController } from './user.controller';

describe('UserController', () => {
  let userController: UserController;
  let useCaseCreateUser: UseCaseCreateUser;
  let userRepository: UsersRepository;
  let encryptorService: EncryptorService;
  let prisma: PrismaService;

  const user = makeFakeUser({}, 1);

  beforeEach(async () => {
    prisma = new PrismaService();
    userRepository = new PrismaUsersRepository(prisma);
    encryptorService = new BcryptEncryptorService();
    useCaseCreateUser = new UseCaseCreateUser(userRepository, encryptorService);
    userController = new UserController(useCaseCreateUser);
  });

  describe('root', () => {
    it('should create user', async () => {
      jest.spyOn(useCaseCreateUser, 'execute').mockResolvedValue(user);

      expect(
        await userController.create({
          email: user.email,
          password: user.password,
        }),
      ).toEqual({
        user: UserViewModel.toHttp(user),
      });
    });
  });
});
