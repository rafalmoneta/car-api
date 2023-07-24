import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const userEmail = 'test321@test.com';
    const { body } = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: userEmail, password: 'password' })
      .expect(201);

    expect(body.id).toBeDefined();
    expect(body.email).toEqual(userEmail);
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const userEmail = 'test123@test.com';
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: userEmail, password: 'password' })
      .expect(201);

    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.id).toBeDefined();
    expect(body.email).toEqual(userEmail);
  });
});
