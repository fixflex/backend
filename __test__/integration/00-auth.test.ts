import request from 'supertest';

import { client as app } from '../../src';
import * as SendMailer from '../../src/helpers/nodemailer';
import * as RandomNum from '../../src/helpers/randomNumGen';
import { user } from '../data';

jest.spyOn(RandomNum, 'randomNum').mockReturnValue('123456');
jest.spyOn(SendMailer, 'sendMailer').mockResolvedValue(true);

let accessToken: string;

describe('Authentication', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('should return 201 and create new user', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send(user);
      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
    });

    it('should return 409 E-Mail address is already exists', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send(user);

      expect(response.status).toBe(409);
      expect(response.body.message).toBeDefined();
    });

    it('fails signup without required fields', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send({ firstName: user.firstName, email: user.email });

      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with correct credentials', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({ email: user.email, password: user.password });
      accessToken = response.body.accessToken;
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      // expect(response.body.token).toBeDefined();
    });

    it('should return 401 Incorrect email or password`', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({ email: user.email, password: 'wrongPassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it('fails login without required fields', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({ name: user.firstName, email: user.email });

      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
  describe('GET /api/v1/auth/refresh-token', () => {
    it('should return 401 Unauthorized', async () => {
      const response = await request(app).get('/api/v1/auth/refresh-token');

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it('should return 200 and refresh token', async () => {
      const loginResponse = await request(app).post('/api/v1/auth/login').send({ email: user.email, password: user.password });
      const response = await request(app).get('/api/v1/auth/refresh-token').set('Cookie', loginResponse.header['set-cookie']);

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
    });
  });

  describe('GET /api/v1/auth/logout', () => {
    it('should return 200 and logout', async () => {
      const loginResponse = await request(app).post('/api/v1/auth/login').send({ email: user.email, password: user.password });

      const response = await request(app).post('/api/v1/auth/logout').set('Cookie', loginResponse.header['set-cookie']);

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/v1/auth/forgot-password', () => {
    it('should return 200 and send reset code', async () => {
      await request(app).post('/api/v1/auth/signup').send(user);
      const response = await request(app).post('/api/v1/auth/forgot-password').send({ email: user.email });
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /api/v1/auth/verify-reset-code', () => {
    it('should return 200 and verify reset code', async () => {
      const response = await request(app).post('/api/v1/auth/verify-reset-code').send({
        resetCode: '123456',
      });
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('PATCH /api/v1/auth/reset-password', () => {
    it('should return 200 and reset password', async () => {
      const response = await request(app).patch('/api/v1/auth/reset-password').send({
        email: user.email,
        newPassword: user.password,
      });
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });

  // {{URL}}/api/v1/auth/change-password
  describe('PATCH /api/v1/auth/change-password', () => {
    it('should return 200 and change password', async () => {
      const response = await request(app)
        .patch('/api/v1/auth/change-password')
        .send({ oldPassword: user.password, newPassword: user.password })
        .set('Cookie', `access_token=${accessToken}`);

      expect(response.status).toBe(200);

      expect(response.body.message).toBeDefined();
    });
  });
});
