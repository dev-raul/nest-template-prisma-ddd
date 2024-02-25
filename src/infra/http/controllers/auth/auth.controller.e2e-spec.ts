import { JWT_REFRESH_TOKEN_SECRECT } from '@config/jwt';
import faker from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src';
import * as request from 'supertest';

import { EncryptorService } from '@domain/services/encryptor/encriptor.service';

import { DatabaseModule } from '@infra/database/database.module';
import { UserViewModel } from '@infra/http/view-models/user-view-model';

import { UserFactory } from '@test/factories/users.factory';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let encryptorService: EncryptorService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, AppModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    encryptorService = moduleRef.get(EncryptorService);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  it('/auth/signin (POST)', async () => {
    const requestBody = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await userFactory.makeUser({
      email: requestBody?.email,
      password: await encryptorService.hash(requestBody?.password),
    });

    const response = await request(app.getHttpServer())
      .post('/api/auth/signin')
      .send(requestBody);

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body?.accessToken).toBeTruthy();
    expect(response.body?.refreshToken).toBeTruthy();
  });

  it('/auth/refresh (POST)', async () => {
    const user = await userFactory.makeUser({
      email: faker.internet.email(),
      password: await encryptorService.hash(faker.internet.password()),
    });

    const refreshToken = await jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        secret: JWT_REFRESH_TOKEN_SECRECT,
      },
    );

    const response = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('/auth/profile (GET)', async () => {
    const user = await userFactory.makeUser({
      email: faker.internet.email(),
      password: await encryptorService.hash(faker.internet.password()),
    });
    const viewModelUser = UserViewModel.toHttp(user);

    const accessToken = await jwtService.signAsync({
      sub: user.id,
    });

    const response = await request(app.getHttpServer())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body).toMatchObject({
      ...viewModelUser,
      createdAt: expect.any(String),
    });
  });
});
