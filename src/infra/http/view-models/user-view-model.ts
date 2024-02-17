import { User } from '@domain/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserViewModelResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;
}

export class UserViewModel {
  static toHttp(user: User): UserViewModelResponse {
    return {
      id: user?.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
