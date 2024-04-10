import request from 'supertest';

import { client } from '../../src';
import { review, user } from '../data';

let userToken: string;
let task: any;
// create user before all tests
beforeAll(async () => {
  const response2 = await request(client).post('/api/v1/auth/login').send({ email: user.email, password: user.password });
  userToken = response2.body.accessToken;

  task = await request(client)
    .get('/api/v1/tasks')
    .then(res => res.body.data[0]);
});

describe('Review', () => {
  // {{URL}}/api/v1/tasks/65e197c8078beaa7fd797f5d/reviews

  it('should not create a review without review data', async () => {
    const response = await request(client).post(`/api/v1/tasks/${task._id}/reviews`).set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(400);
  });

  it('should create a review', async () => {
    const response = await request(client)
      .post(`/api/v1/tasks/${task._id}/reviews`)
      .send(review)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('_id');
  });

  it('should get reviews', async () => {
    const response = await request(client).get(`/api/v1/tasks/${task._id}/reviews`).set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(200);
  });

  //   it('should update a review', async () => {
  //     const response = await request(client)
  //       .patch(`/api/v1/tasks/${task._id}/reviews`)
  //       .send({ review: 'The task was done on time' })
  //       .set('Authorization', `Bearer ${userToken}`);

  //     expect(response.status).toBe(200);
  //     expect(response.body.data.review).toBe('The task was done on time');
  //   });

  //   it('should delete a review', async () => {
  //     const response = await request(client).delete(`/api/v1/tasks/${task._id}/reviews`).set('Authorization', `Bearer ${userToken}`);

  //     expect(response.status).toBe(204);
  //     expect(response.body.data).toBe(null);
  //   });
});
