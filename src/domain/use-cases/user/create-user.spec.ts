import faker from '@faker-js/faker';

import { EncryptorService } from '@domain/services/encryptor/encriptor.service';
import { UseCaseCreateUser } from '@domain/use-cases/user/create-user';
import { EmailAlreadyExistError } from '@domain/value-objects/errors/email-already-exist-error';
import { EmailBadFormattedError } from '@domain/value-objects/errors/email-bad-formatted-error';

import { UsersRepository } from '@infra/database/repositories/users.repository';
import { BcryptEncryptorService } from '@infra/http/services/encryptor/bcrypt-encriptor-service';

import { makeFakeUser } from '@test/factories/users.factory';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository';

jest.useFakeTimers({
  now: new Date('2023-02-25T16:33:55.016Z'),
});

describe('UseCaseCreateUser', () => {
  let useCaseCreateUser: UseCaseCreateUser;
  let userRepository: UsersRepository;
  let encryptorService: EncryptorService;

  const user = makeFakeUser(
    {
      password: 'HASH_PASSWORD',
    },
    1,
  );

  beforeEach(async () => {
    encryptorService = new BcryptEncryptorService();
    userRepository = new InMemoryUsersRepository();
    useCaseCreateUser = new UseCaseCreateUser(userRepository, encryptorService);
  });

  it('should error to email bad formated', async () => {
    await expect(
      useCaseCreateUser.execute({
        email: 'invalid-email',
        password: user.password,
      }),
    ).rejects.toThrow(EmailBadFormattedError);
  });

  it('should error to already exist user', async () => {
    await userRepository.create(user);
    await expect(
      useCaseCreateUser.execute({
        email: user.email,
        password: user.password,
      }),
    ).rejects.toThrow(EmailAlreadyExistError);
  });

  it('should create user', async () => {
    jest.spyOn(encryptorService, 'hash').mockResolvedValue(user.password);

    expect(
      await useCaseCreateUser.execute({
        email: user.email,
        password: faker.internet.password(),
      }),
    ).toEqual(user);
  });
});
