import { Injectable } from '@nestjs/common';

import { AsyncMaybe } from '@core/logic/Maybe';

import { User } from '@domain/entities/user.entity';

import { UsersRepository } from '@infra/database/repositories/users.repository';

import { UserMapper } from '../mappers/user.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): AsyncMaybe<User> {
    const userCreated = await this.prisma.user.create({
      data: UserMapper.toPrisma(user),
    });

    return UserMapper.toDomain(userCreated);
  }

  async findByEmail(email: string): AsyncMaybe<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async findById(id: number): AsyncMaybe<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }
}
