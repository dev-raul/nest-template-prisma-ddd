import { Either, left, right } from '@core/logic/Either';
import { User } from '@domain/entities/user.entity';
import { Email } from '@domain/value-objects/email';
import { EmailAlreadyExistError } from '@domain/value-objects/errors/email-already-exist-error';
import { EmailBadFormattedError } from '@domain/value-objects/errors/email-bad-formatted-error';
import { UsersRepository } from '@infra/database/repositories/users.repository';
import { Injectable } from '@nestjs/common';

type CreateUserRequest = {
  email: string;
  password: string;
};

type CreateUserResponse = User;

@Injectable()
export class CreateUser {
  constructor(private userRepository: UsersRepository) {}
  async execute({
    email,
    password,
  }: CreateUserRequest): Promise<CreateUserResponse> {
    const isInvalidEmail = !Email.validate(email);

    if (isInvalidEmail) {
      throw new EmailBadFormattedError(email);
    }

    const findUser = await this.userRepository.findByEmail(email);
    if (findUser) throw new EmailAlreadyExistError(email);

    const user = User.create({
      email,
      password,
    });

    const createdUser = await this.userRepository.create(user);

    return createdUser;
  }
}
