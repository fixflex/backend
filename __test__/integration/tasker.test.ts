import mongoose from 'mongoose';
import request from 'supertest';

import { client as app } from '../../src';
import categoryModel from '../../src/DB/models/category.model';
import UserModel from '../../src/DB/models/user.model';
import { createAccessToken } from '../../src/helpers';

let token: string;
let category: any;
let taskerId: string;

const newUserData = {
  firstName: 'john',
  lastName: 'doe',
  email: 'john@gmail.com',
  password: 'password',
};

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  //   app.close();
});

// create user before all tests
beforeAll(async () => {
  const user = await UserModel.create(newUserData);
  token = createAccessToken(user._id);
  // create category
  category = await categoryModel.create({ name: { en: 'plumbing', ar: 'السباكة' } });
});

// afterEach(async () => {
//   await User.deleteMany({});
// });

describe('tasker', () => {
  describe('POST /api/v1/become-tasker', () => {
    it('should create a new tasker', async () => {
      const response = await request(app)
        .post('/api/v1/taskers/become-tasker')
        .set('Authorization', `Bearer ${token}`)
        .send({
          categories: [category._id],
          location: {
            coordinates: [31.185277, 27.174436],
          },
          phoneNumber: '01066032817',
        });
      taskerId = response.body.data._id;
      expect(response.status).toBe(201);
      expect(response.body.data.categories).toHaveLength(1);
    });
    // if no categories are provided
    it('should return 400 if no categories are provided', async () => {
      const response = await request(app)
        .post('/api/v1/taskers/become-tasker')
        .set('Authorization', `Bearer ${token}`)
        .send({ categories: [] });
      expect(response.status).toBe(400);
    });
    // if category id is not valid
    it('should return 404 if category id is not valid', async () => {
      const response = await request(app)
        .post('/api/v1/taskers/become-tasker')
        .set('Authorization', `Bearer ${token}`)
        .send({ categories: ['123'] });
      expect(response.status).toBe(400);
    });
    // if category id not found in DB
    it('should return 404 if category id not found in DB', async () => {
      const response = await request(app)
        .post('/api/v1/taskers/become-tasker')
        .set('Authorization', `Bearer ${token}`)
        .send({
          categories: ['64f0d1196cbe0251ae16b092'],
          location: {
            coordinates: [31.185277, 27.174436],
          },
          phoneNumber: '01066042222',
        });
      expect(response.status).toBe(404);
    });
    it('should return 401 if no token is provided', async () => {
      const response = await request(app).post('/api/v1/taskers/become-tasker');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/taskers/:id', () => {
    it('should return a tasker by ID', async () => {
      const response = await request(app).get(`/api/v1/taskers/${taskerId}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data._id).toBe(taskerId.toString());
    });
    it('should return 404 if tasker not found', async () => {
      const response = await request(app).get('/api/v1/taskers/64f0d1196cbe0251ae16b092').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/v1/taskers', () => {
    it('should return all taskers', async () => {
      const response = await request(app).get('/api/v1/taskers').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });
  });
  // TODO: test filtering by category, location, rating, price

  describe('PATCH /api/v1/taskers/me', () => {
    it('should update tasker data', async () => {
      const response = await request(app)
        .patch('/api/v1/taskers/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ phoneNumber: '01066032817' });
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  // describe('DELETE /api/v1/taskers/me', () => {
  //   it('should delete tasker', async () => {
  //     const response = await request(app).delete('/api/v1/taskers/me').set('Authorization', `Bearer ${token}`);
  //     expect(response.status).toBe(204);
  //   });
  //   it('should return 404 there is no tasker with this user id', async () => {
  //     const response = await request(app).delete('/api/v1/taskers/me').set('Authorization', `Bearer ${token}`);
  //     expect(response.status).toBe(404);
  //   });
  // });

}); 