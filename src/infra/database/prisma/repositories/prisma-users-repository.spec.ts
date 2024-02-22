import { Test } from '@nestjs/testing';

import { UsersRepository } from '@infra/database/repositories/users.repository';

import { makeFakeUser } from '@test/factories/users.factory';

import { UserMapper } from '../mappers/user.mapper';
import { PrismaService } from '../prisma.service';
import { PrismaUsersRepository } from './prisma-users-repository';

jest.useFakeTimers({
  now: new Date('2023-02-25T16:33:55.016Z'),
});

describe('PrismaUsersRepository', () => {
  let prismaService: PrismaService;
  let usersRepository: UsersRepository;

  const user = makeFakeUser({}, 1);
  const userToDomain = {
    id: 1,
    email: user.email,
    password: user.password,
    created_at: user.createdAt,
    updated_at: user.createdAt,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: UsersRepository,
          useClass: PrismaUsersRepository,
        },
      ],
    }).compile();

    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should create user', async () => {
    jest.spyOn(prismaService.user, 'create').mockResolvedValue(userToDomain);
    const newUser = await usersRepository.create(user);

    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: UserMapper.toPrisma(user),
    });
    expect(newUser).toEqual(UserMapper.toDomain(userToDomain));
  });

  it('should get user by email', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
    expect(await usersRepository.findByEmail(user.email)).toBeNull();

    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: {
        email: user.email,
      },
    });

    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(userToDomain);
    expect(await usersRepository.findByEmail(user.email)).toEqual(
      UserMapper.toDomain(userToDomain),
    );
  });

  it('should get user by id', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
    expect(await usersRepository.findById(user.id)).toBeNull();

    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: user.id,
      },
    });

    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(userToDomain);
    expect(await usersRepository.findById(user.id)).toEqual(
      UserMapper.toDomain(userToDomain),
    );
  });
});
