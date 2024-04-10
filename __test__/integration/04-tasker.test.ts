import request from 'supertest';

import { client } from '../../src';
import * as RandomNum from '../../src/helpers/randomNumGen';
import * as SendWhatsappMessage from '../../src/helpers/sendWhatsappMessage';
import { user2 } from '../data';

jest.spyOn(RandomNum, 'randomNum').mockReturnValue('123456');
jest.spyOn(SendWhatsappMessage, 'sendWhatsappMessage').mockResolvedValue(true); //  use resolvedValue for async functions

let token: string;
let category: any;
let taskerId: string;

// create user before all tests
beforeAll(async () => {
  const response = await request(client).post('/api/v1/auth/signup').send(user2);
  token = response.body.accessToken;
  category = await request(client)
    .get('/api/v1/categories')
    .then(res => res.body.data[0]);
});

describe('tasker', () => {
  describe('POST /api/v1/become-tasker', () => {
    // if no categories are provided
    it('should return 400 if no categories are provided', async () => {
      const response = await request(client)
        .post('/api/v1/taskers/become-tasker')
        .set('Authorization', `Bearer ${token}`)
        .send({ categories: [] });
      expect(response.status).toBe(400);
    });
    // if category id is not valid
    it('should return 404 if category id is not valid', async () => {
      const response = await request(client)
        .post('/api/v1/taskers/become-tasker')
        .set('Authorization', `Bearer ${token}`)
        .send({ categories: ['123'] });
      expect(response.status).toBe(400);
    });
    // if category id not found in DB
    it('should return 404 if category id not found in DB', async () => {
      const response = await request(client)
        .post('/api/v1/taskers/become-tasker')
        .set('Authorization', `Bearer ${token}`)
        .send({
          categories: ['64f0d1196cbe0251ae16b092'],
          location: {
            coordinates: [31.185277, 27.174436],
          },
        });
      expect(response.status).toBe(404);
    });

    it('should create a new tasker', async () => {
      const response = await request(client)
        .post('/api/v1/taskers/become-tasker')
        .set('Authorization', `Bearer ${token}`)
        .send({
          categories: [category._id],
          location: {
            coordinates: [31.185277, 27.174436],
          },
        });
      taskerId = response.body.data._id;
      expect(response.status).toBe(201);
      expect(response.body.data.categories).toHaveLength(1);
    });
  });

  describe('GET /api/v1/taskers/:id', () => {
    it('should return a tasker by ID', async () => {
      const response = await request(client).get(`/api/v1/taskers/${taskerId}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data._id).toBe(taskerId.toString());
    });
    it('should return 404 if tasker not found', async () => {
      const response = await request(client).get('/api/v1/taskers/64f0d1196cbe0251ae16b092').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/v1/taskers', () => {
    it('should return all taskers', async () => {
      const response = await request(client).get('/api/v1/taskers').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });
  });
  // TODO: test filtering by category, location, rating, price

  describe('PATCH /api/v1/taskers/me', () => {
    it('should update tasker data', async () => {
      const response = await request(client)
        .patch('/api/v1/taskers/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ phoneNumber: '01066032817' });
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('POST /api/v1/users/send-verification-code', () => {
    it('should send verification code', async () => {
      const response = await request(client).get('/api/v1/users/send-verification-code').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /api/v1/users/verify', () => {
    it('should verify user', async () => {
      const response = await request(client)
        .post('/api/v1/users/verify')
        .set('Authorization', `Bearer ${token}`)
        .send({ verificationCode: '123456' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });

  // describe('DELETE /api/v1/taskers/me', () => {
  //   it('should delete tasker', async () => {
  //     const response = await request(client).delete('/api/v1/taskers/me').set('Authorization', `Bearer ${token}`);
  //     expect(response.status).toBe(204);
  //   });
  //   it('should return 404 there is no tasker with this user id', async () => {
  //     const response = await request(client).delete('/api/v1/taskers/me').set('Authorization', `Bearer ${token}`);
  //     expect(response.status).toBe(404);
  //   });
  // });
});
