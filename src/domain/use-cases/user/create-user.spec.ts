import faker from '@faker-js/faker';
import { Test } from '@nestjs/testing';

import { User } from '@domain/entities/user.entity';
import { EncryptorService } from '@domain/services/encryptor/encriptor.service';
import { UseCaseCreateUser } from '@domain/use-cases/user/create-user';
import { EmailAlreadyExistError } from '@domain/value-objects/errors/email-already-exist-error';
import { EmailBadFormattedError } from '@domain/value-objects/errors/email-bad-formatted-error';

import { DatabaseModule } from '@infra/database/database.module';
import { UsersRepository } from '@infra/database/repositories/users.repository';
import { ServicesModule } from '@infra/http/services/services';

import { makeFakeUser } from '@test/factories/users.factory';

import { UseCaseUserModule } from './usecase-user.module';

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
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule, ServicesModule, UseCaseUserModule],
    }).compile();

    useCaseCreateUser = moduleRef.get<UseCaseCreateUser>(UseCaseCreateUser);
    userRepository = moduleRef.get<UsersRepository>(UsersRepository);
    encryptorService = moduleRef.get<EncryptorService>(EncryptorService);
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
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);
    await expect(
      useCaseCreateUser.execute({
        email: user.email,
        password: user.password,
      }),
    ).rejects.toThrow(EmailAlreadyExistError);
  });

  it('should create user', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(userRepository, 'create').mockResolvedValue(user);
    jest.spyOn(encryptorService, 'hash').mockResolvedValue(user.password);

    expect(
      await useCaseCreateUser.execute({
        email: user.email,
        password: faker.internet.password(),
      }),
    ).toEqual(user);

    expect(userRepository.create).toHaveBeenCalledWith(
      User.create({
        email: user.email,
        password: user.password,
      }),
    );
  });
});
