import { Injectable } from '@nestjs/common';
import { User } from '@domain/entities/user.entity';
import { NotFoundError } from '@domain/value-objects/errors/not-found-error';
import { UsersRepository } from '@infra/database/repositories/users.repository';

type UseCaseGetUserRequest = {
  id: number;
};

type UseCaseGetUserResponse = User;

@Injectable()
export class UseCaseGetUser {
  constructor(private userRepository: UsersRepository) {}
  async execute({
    id,
  }: UseCaseGetUserRequest): Promise<UseCaseGetUserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError('user');

    return user;
  }
}
