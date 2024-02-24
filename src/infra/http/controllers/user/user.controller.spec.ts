import { EncryptorService } from '@domain/services/encryptor/encriptor.service';
import { UseCaseCreateUser } from '@domain/use-cases/user/create-user';

import { UsersRepository } from '@infra/database/repositories/users.repository';
import { BcryptEncryptorService } from '@infra/http/services/encryptor/bcrypt-encriptor-service';
import { UserViewModel } from '@infra/http/view-models/user-view-model';

import { makeFakeUser } from '@test/factories/users.factory';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository';

import { UserController } from './user.controller';

describe('UserController', () => {
  let userController: UserController;
  let useCaseCreateUser: UseCaseCreateUser;
  let userRepository: UsersRepository;
  let encryptorService: EncryptorService;

  const user = makeFakeUser({}, 1);

  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository();
    encryptorService = new BcryptEncryptorService();
    useCaseCreateUser = new UseCaseCreateUser(userRepository, encryptorService);
    userController = new UserController(useCaseCreateUser);
  });

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
