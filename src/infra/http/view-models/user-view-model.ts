import { User } from '@domain/entities/user.entity';

export class UserViewModel {
  static toHttp(user: User) {
    return {
      id: user?.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
