import mongoose from 'mongoose';
import request from 'supertest';
import { expect, jest } from '@jest/globals';
import { client as app } from '../../src/';
import User from '../../src/DB/models/user.model';
import * as RandomNum from '../../src/helpers/randomNumGen';

jest.spyOn(RandomNum, 'randomNum').mockReturnValue('123456');


afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

let deleteUsers = true; // Flag to control whether to delete users or not
beforeEach(async () => {
  if (deleteUsers) {
    await User.deleteMany({});
  }
});


const newUserData = {
  firstName: 'ahmad',
  lastName: 'alasiri',
  email: 'ahmad@example.com',
  password: 'password123',
};

describe('Authentication', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('should return 201 and create new user', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send(newUserData);
      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
      // expect(response.body.token).toBeDefined();
    });

    it('should return 409 E-Mail address is already exists', async () => {
      await request(app).post('/api/v1/auth/signup').send(newUserData);
      const response = await request(app).post('/api/v1/auth/signup').send(newUserData);

      expect(response.status).toBe(409);
      expect(response.body.message).toBeDefined();
    });

    it('fails signup without required fields', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send({ firstName: newUserData.firstName, email: newUserData.email });

      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('can log in with email', async () => {
      await request(app).post('/api/v1/auth/signup').send(newUserData);
      const response = await request(app).post('/api/v1/auth/login').send({ email: newUserData.email, password: newUserData.password });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      // expect(response.body.token).toBeDefined();
    });

    it('should return 401 Incorrect email or password`', async () => {
      await request(app).post('/api/v1/auth/signup').send(newUserData);
      const response = await request(app).post('/api/v1/auth/login').send({ email: newUserData.email, password: 'wrongPassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it('fails login without required fields', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send({ name: newUserData.firstName, email: newUserData.email });

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
      await request(app).post('/api/v1/auth/signup').send(newUserData);
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: newUserData.email, password: newUserData.password });
      const response = await request(app).get('/api/v1/auth/refresh-token').set('Cookie', loginResponse.header['set-cookie']);

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
    });
  });

  describe('forgot-password, verify-reset-code, reset-password', () => {
    deleteUsers = false;
    it('should return 200 and send reset code', async () => {
      await request(app).post('/api/v1/auth/signup').send(newUserData);
      const response = await request(app).post('/api/v1/auth/forgot-password').send({ email: newUserData.email });
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();

    });

    it('should return 200 and verify reset code', async () => {
      const response2 = await request(app).post('/api/v1/auth/verify-reset-code').send({
        resetCode: '123456'
      });
      expect(response2.status).toBe(200);
      expect(response2.body.message).toBeDefined();
    });

    it('should return 200 and reset password', async () => {
      const response3 = await request(app).patch('/api/v1/auth/reset-password').send({
        email: newUserData.email,
        newPassword: 'newPassword123'
      });
      expect(response3.status).toBe(200);
      expect(response3.body.message).toBeDefined();
    });
  });
});
