import { NotFoundError } from '@domain/value-objects/errors/not-found-error';

import { UsersRepository } from '@infra/database/repositories/users.repository';

import { makeFakeUser } from '@test/factories/users.factory';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository';

import { UseCaseGetUserById } from './get-user-by-id';

jest.useFakeTimers({
  now: new Date('2023-02-25T16:33:55.016Z'),
});

describe('UseCaseGetUserById', () => {
  let useCaseGetUserById: UseCaseGetUserById;
  let userRepository: UsersRepository;

  const user = makeFakeUser({}, 1);

  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository();
    useCaseGetUserById = new UseCaseGetUserById(userRepository);
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
