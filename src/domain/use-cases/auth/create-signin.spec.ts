import { jwtConfig } from '@config/jwt';
import faker from '@faker-js/faker';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { EncryptorService } from '@domain/services/encryptor/encriptor.service';
import { EmailBadFormattedError } from '@domain/value-objects/errors/email-bad-formatted-error';
import { InvalidCredentialError } from '@domain/value-objects/errors/invalid-credential-error';
import { NotFoundError } from '@domain/value-objects/errors/not-found-error';

import { DatabaseModule } from '@infra/database/database.module';
import { UsersRepository } from '@infra/database/repositories/users.repository';
import { ServicesModule } from '@infra/http/services/services';

import { makeFakeUser } from '@test/factories/users.factory';

import { UseCaseCreateSignIn } from './create-signin';
import { UseCaseAuthModule } from './usecase-auth.module';

describe('UseCaseCreateSignIn', () => {
  let useCaseCreateSignIn: UseCaseCreateSignIn;
  let userRepository: UsersRepository;
  let encryptorService: EncryptorService;
  let jwtService: JwtService;

  const user = makeFakeUser({}, 1);
  const dataToken = {
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        ServicesModule,
        JwtModule.register(jwtConfig),
        UseCaseAuthModule,
      ],
    }).compile();

    useCaseCreateSignIn =
      moduleRef.get<UseCaseCreateSignIn>(UseCaseCreateSignIn);
    userRepository = moduleRef.get<UsersRepository>(UsersRepository);
    encryptorService = moduleRef.get<EncryptorService>(EncryptorService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it('should error to email bad formated', async () => {
    await expect(
      useCaseCreateSignIn.execute({
        email: 'invalid-email',
        password: user.password,
      }),
    ).rejects.toThrow(EmailBadFormattedError);
  });

  it('should error to not exist user', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
    await expect(
      useCaseCreateSignIn.execute({
        email: user.email,
        password: user.password,
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should error to invalid credential', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);
    jest.spyOn(encryptorService, 'compare').mockResolvedValue(false);

    await expect(
      useCaseCreateSignIn.execute({
        email: user.email,
        password: faker.internet.password(),
      }),
    ).rejects.toThrow(InvalidCredentialError);
  });

  it('should create signin', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);
    jest.spyOn(encryptorService, 'compare').mockResolvedValue(true);
    jest
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValueOnce(dataToken.accessToken)
      .mockResolvedValue(dataToken.refreshToken);

    expect(
      await useCaseCreateSignIn.execute({
        email: user.email,
        password: user.password,
      }),
    ).toEqual(dataToken);
  });
});
