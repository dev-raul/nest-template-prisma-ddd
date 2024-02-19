import { Test } from '@nestjs/testing';

import { NotFoundError } from '@domain/value-objects/errors/not-found-error';

import { DatabaseModule } from '@infra/database/database.module';
import { UsersRepository } from '@infra/database/repositories/users.repository';
import { ServicesModule } from '@infra/http/services/services';

import { makeFakeUser } from '@test/factories/users.factory';

import { UseCaseGetUserById } from './get-user-by-id';
import { UseCaseUserModule } from './usecase-user.module';

jest.useFakeTimers({
  now: new Date('2023-02-25T16:33:55.016Z'),
});

describe('UseCaseGetUserById', () => {
  let useCaseGetUserById: UseCaseGetUserById;
  let userRepository: UsersRepository;

  const user = makeFakeUser({}, 1);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule, ServicesModule, UseCaseUserModule],
    }).compile();

    useCaseGetUserById = moduleRef.get<UseCaseGetUserById>(UseCaseGetUserById);
    userRepository = moduleRef.get<UsersRepository>(UsersRepository);
  });

  it('should error to not exist user', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(null);
    await expect(
      useCaseGetUserById.execute({
        id: user.id,
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should get user', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(user);

    expect(
      await useCaseGetUserById.execute({
        id: user.id,
      }),
    ).toEqual(user);
    expect(userRepository.findById).toHaveBeenCalledWith(user.id);
  });
});
