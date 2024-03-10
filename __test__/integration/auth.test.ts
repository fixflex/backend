import mongoose from 'mongoose';
import request from 'supertest';

import { client as app } from '../../src/';
// import { app } from '../../src';
import User from '../../src/DB/models/user.model';

// let app = App.getServer();

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  //   app.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

const newUserData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'John@gmail.com',
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
});
