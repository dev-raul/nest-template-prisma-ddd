import { Test } from '@nestjs/testing';

import { UseCaseCreateUser } from '@domain/use-cases/user/create-user';

import { DatabaseModule } from '@infra/database/database.module';
import { ServicesModule } from '@infra/http/services/services';
import { UserViewModel } from '@infra/http/view-models/user-view-model';

import { makeFakeUser } from '@test/factories/users.factory';

import { UserController } from './user.controller';

describe('UserController', () => {
  let userController: UserController;
  let useCaseCreateUser: UseCaseCreateUser;

  const user = makeFakeUser({}, 1);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule, ServicesModule],
      controllers: [UserController],
      providers: [UseCaseCreateUser],
    }).compile();

    useCaseCreateUser = moduleRef.get<UseCaseCreateUser>(UseCaseCreateUser);
    userController = moduleRef.get<UserController>(UserController);
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
