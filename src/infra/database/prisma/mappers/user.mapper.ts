import { Prisma, User as RawUser } from '@prisma/client';

import { User } from '@domain/entities/user.entity';

export class UserMapper {
  static toDomain(raw: RawUser): User {
    const user = User.create(
      {
        email: raw.email,
        password: raw.password,
        createdAt: raw.created_at,
      },
      raw.id,
    );

    return user;
  }

  static toPrisma(user: User): Prisma.UserCreateInput {
    return {
      password: user.password,
      email: user.email,
      created_at: user.createdAt,
    };
  }
}
