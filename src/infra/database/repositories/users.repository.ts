import { Injectable } from '@nestjs/common';

import { AsyncMaybe } from '@core/logic/Maybe';

import { User } from '@domain/entities/user.entity';

@Injectable()
export abstract class UsersRepository {
  abstract create(user: User): AsyncMaybe<User>;
  abstract findByEmail(email: string): AsyncMaybe<User>;
  abstract findById(id: number): AsyncMaybe<User>;
}
