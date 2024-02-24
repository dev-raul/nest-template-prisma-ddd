import { User as RawUser } from '@prisma/client';

import { AsyncMaybe } from '@core/logic/Maybe';

import { User } from '@domain/entities/user.entity';

import { UserMapper } from '@infra/database/prisma/mappers/user.mapper';
import { UsersRepository } from '@infra/database/repositories/users.repository';

export class InMemoryUsersRepository implements UsersRepository {
  public items: Array<RawUser> = [];

  async create(user: User): Promise<User> {
    const rawUser: RawUser = {
      id: this.items.length + 1,
      email: user.email,
      password: user.password,
      created_at: user.createdAt,
      updated_at: user.updateAt,
    };

    this.items.push(rawUser);

    return UserMapper.toDomain(rawUser);
  }

  async findByEmail(email: string): AsyncMaybe<User> {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async findById(id: number): AsyncMaybe<User> {
    const user = this.items.find((item) => item.id === id);

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }
}
