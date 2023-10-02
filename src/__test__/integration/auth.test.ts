import mongoose from 'mongoose';
import request from 'supertest';

import { server } from '../../';
import User from '../../DB/models/client.model';

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  server.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

const newUserData = {
  name: 'John Doe',
  email: 'John@gmail.com',
  username: 'JohnDoe',
  password: 'password123',
  confirmPassword: 'password123',
};

describe('Authentication', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('should return 201 and create new user', async () => {
      const response = await request(server).post('/api/v1/auth/signup').send(newUserData);

      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
      expect(response.body.token).toBeDefined();
    });

    it('should return 409 E-Mail address is already exists', async () => {
      await request(server).post('/api/v1/auth/signup').send(newUserData);
      const response = await request(server).post('/api/v1/auth/signup').send(newUserData);

      expect(response.status).toBe(409);
      expect(response.body.message).toBeDefined();
    });

    it('should return 409 Username already in use', async () => {
      await request(server).post('/api/v1/auth/signup').send(newUserData);
      const response = await request(server).post('/api/v1/auth/signup').send({
        name: newUserData.name,
        email: 'newEmail@gmail.com',
        username: newUserData.username,
        password: newUserData.password,
        confirmPassword: newUserData.confirmPassword,
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toBeDefined();
    });

    it('fails signup without required fields', async () => {
      const response = await request(server)
        .post('/api/v1/auth/signup')
        .send({ name: newUserData.name, email: newUserData.email });

      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('can log in with username', async () => {
      await request(server).post('/api/v1/auth/signup').send(newUserData);
      const response = await request(server)
        .post('/api/v1/auth/login')
        .send({ emailOrUsername: newUserData.username, password: newUserData.password });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.token).toBeDefined();
    });

    it('can log in with email', async () => {
      await request(server).post('/api/v1/auth/signup').send(newUserData);
      const response = await request(server)
        .post('/api/v1/auth/login')
        .send({ emailOrUsername: newUserData.email, password: newUserData.password });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.token).toBeDefined();
    });

    it('should return 401 Incorrect (email | username) or password`', async () => {
      await request(server).post('/api/v1/auth/signup').send(newUserData);
      const response = await request(server)
        .post('/api/v1/auth/login')
        .send({ emailOrUsername: newUserData.email, password: 'wrongPassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it('fails login without required fields', async () => {
      const response = await request(server)
        .post('/api/v1/auth/signup')
        .send({ name: newUserData.name, email: newUserData.email });

      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
});
