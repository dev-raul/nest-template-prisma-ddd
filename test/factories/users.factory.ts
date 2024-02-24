import faker from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { Replace } from '@core/logic/Replace';

import { User, UserProps } from '@domain/entities/user.entity';

import { UserMapper } from '@infra/database/prisma/mappers/user.mapper';
import { PrismaService } from '@infra/database/prisma/prisma.service';

type Overrides = Partial<
  Replace<
    UserProps,
    {
      email?: string;
      createdAt?: Date;
      updateAt?: Date;
    }
  >
>;

export function makeFakeUser(data = {} as Overrides, id?: number) {
  const email = faker.internet.email();
  const password = faker.internet.password();
  const createdAt = new Date();
  const updateAt = new Date();

  const props: UserProps = {
    email: data.email || email,
    password: data.password || password,
    createdAt: data.createdAt || createdAt,
    updateAt: data.updateAt || updateAt,
  };

  const user = User.create(props, id);

  return user;
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makeUser(data = {} as Overrides, id?: number): Promise<User> {
    const user = makeFakeUser(data, id);

    const rawUser = await this.prisma.user.create({
      data: UserMapper.toPrisma(user),
    });

    return UserMapper.toDomain(rawUser);
  }
}
