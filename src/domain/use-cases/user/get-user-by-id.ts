import { Injectable } from '@nestjs/common';

import { User } from '@domain/entities/user.entity';
import { NotFoundError } from '@domain/value-objects/errors/not-found-error';

import { UsersRepository } from '@infra/database/repositories/users.repository';

type UseCaseGetUserByIdRequest = {
  id: number;
};

type UseCaseGetUserByIdResponse = User;

@Injectable()
export class UseCaseGetUserById {
  constructor(private userRepository: UsersRepository) {}
  async execute({
    id,
  }: UseCaseGetUserByIdRequest): Promise<UseCaseGetUserByIdResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError('user');

    return user;
  }
}
