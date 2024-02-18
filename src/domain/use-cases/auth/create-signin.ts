import { EncryptorService } from '@domain/services/encryptor/encriptor.service';
import { Email } from '@domain/value-objects/email';
import { EmailBadFormattedError } from '@domain/value-objects/errors/email-bad-formatted-error';
import { InvalidCredentialError } from '@domain/value-objects/errors/invalid-credential-error';
import { NotFoundError } from '@domain/value-objects/errors/not-found-error';
import { UsersRepository } from '@infra/database/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type UseCaseCreateSignInRequest = {
  email: string;
  password: string;
};

type UseCaseCreateSignInResponse = {
  accessToken: string;
};

@Injectable()
export class UseCaseCreateSignIn {
  constructor(
    private userRepository: UsersRepository,
    private encryptorService: EncryptorService,
    private jwtService: JwtService,
  ) {}
  async execute({
    email,
    password,
  }: UseCaseCreateSignInRequest): Promise<UseCaseCreateSignInResponse> {
    const isInvalidEmail = !Email.validate(email);

    if (isInvalidEmail) {
      throw new EmailBadFormattedError(email);
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new NotFoundError('user');

    const isValidPassword = await this.encryptorService.compare(
      password,
      user.password,
    );

    if (!isValidPassword) throw new InvalidCredentialError();

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
    });

    return { accessToken };
  }
}
