import request from 'supertest';

import { client } from '../../src';
import { offer, user, user2 } from '../data';

let taskerToken: string;
let userToken: string;
let task: any;

// create user before all tests
beforeAll(async () => {
  const response1 = await request(client).post('/api/v1/auth/login').send({ email: user2.email, password: user2.password });
  taskerToken = response1.body.accessToken;

  const response2 = await request(client).post('/api/v1/auth/login').send({ email: user.email, password: user.password });
  userToken = response2.body.accessToken;
  task = await request(client)
    .get('/api/v1/tasks')
    .then(res => res.body.data[0]);

  offer.taskId = task._id;
});

describe('Offer', () => {
  let offerId: string;

  it('should not create an offer without offer data', async () => {
    const response = await request(client).post('/api/v1/offers').set('Authorization', `Bearer ${taskerToken}`);

    expect(response.status).toBe(400);
  });
  it('should create an offer', async () => {
    const response = await request(client).post('/api/v1/offers').send(offer).set('Authorization', `Bearer ${taskerToken}`);
    offerId = response.body.data._id;
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('_id');
  });

  it('should update an offer', async () => {
    const response = await request(client)
      .patch(`/api/v1/offers/${offerId}`)
      .send({ price: 4000 })
      .set('Authorization', `Bearer ${taskerToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.price).toBe(4000);
  });

  it('should get offers', async () => {
    const response = await request(client).get(`/api/v1/offers`).set('Authorization', `Bearer ${taskerToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it('should accept the offer and pay cash', async () => {
    const response = await request(client).patch(`/api/v1/offers/${offerId}/accept`).set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('ACCEPTED');
  });

  describe('Complete Task', () => {
    it('should complete the task', async () => {
      const response = await request(client).patch(`/api/v1/tasks/${task._id}/complete`).set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('COMPLETED');
    });
  });
  // TODO: test the online payment
});
