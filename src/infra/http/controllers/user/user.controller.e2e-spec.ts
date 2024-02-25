import faker from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src';
import * as request from 'supertest';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/users (POST)', async () => {
    const requestBody = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await request(app.getHttpServer())
      .post('/api/users')
      .send(requestBody);

    expect(response.status).toEqual(HttpStatus.CREATED);
    expect(response.body).toBeDefined();
    expect(response.body?.user?.email).toEqual(requestBody?.email);
  });
});
