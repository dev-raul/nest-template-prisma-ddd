import { Injectable } from '@nestjs/common';

import { User } from '@domain/entities/user.entity';
import { EncryptorService } from '@domain/services/encryptor/encriptor.service';
import { Email } from '@domain/value-objects/email';
import { EmailAlreadyExistError } from '@domain/value-objects/errors/email-already-exist-error';
import { EmailBadFormattedError } from '@domain/value-objects/errors/email-bad-formatted-error';

import { UsersRepository } from '@infra/database/repositories/users.repository';

type UseCaseCreateUserRequest = {
  email: string;
  password: string;
};

type UseCaseCreateUserResponse = User;

@Injectable()
export class UseCaseCreateUser {
  constructor(
    private userRepository: UsersRepository,
    private encryptorService: EncryptorService,
  ) {}
  async execute({
    email,
    password: _password,
  }: UseCaseCreateUserRequest): Promise<UseCaseCreateUserResponse> {
    const isInvalidEmail = !Email.validate(email);

    if (isInvalidEmail) {
      throw new EmailBadFormattedError(email);
    }

    const findUser = await this.userRepository.findByEmail(email);
    if (findUser) throw new EmailAlreadyExistError(email);

    const password = await this.encryptorService.hash(_password);

    const user = User.create({
      email,
      password,
    });

    const createdUser = await this.userRepository.create(user);

    return createdUser;
  }
}
