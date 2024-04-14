import request from 'supertest';

import { client } from '../../src';
import { user } from '../data';

let userToken: string;
let tasker: any;

beforeAll(async () => {
  const response2 = await request(client).post('/api/v1/auth/login').send({ email: user.email, password: user.password });
  userToken = response2.body.accessToken;

  tasker = await request(client)
    .get('/api/v1/taskers')
    .then(res => res.body.data[0]);
});

describe('Chat', () => {
  it('should not create a chat room without tasker id', async () => {
    const response = await request(client).post('/api/v1/chats').set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(400);
  });

  it('should create a chat room', async () => {
    const response = await request(client).post('/api/v1/chats').send({ tasker: tasker._id }).set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.tasker).toBe(tasker._id);
  });

  it('should get user chats', async () => {
    const response = await request(client).get(`/api/v1/chats`).set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it('should get chat by id', async () => {
    const response1 = await request(client).get(`/api/v1/chats`).set('Authorization', `Bearer ${userToken}`);

    const response2 = await request(client).get(`/api/v1/chats/${response1.body.data[0]._id}`).set('Authorization', `Bearer ${userToken}`);
    expect(response2.status).toBe(200);
    expect(response2.body.data).toHaveProperty('_id');
  });
});
