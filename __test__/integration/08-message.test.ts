import request from 'supertest';

import { client } from '../../src';
import { user } from '../data';

let userToken: string;
let chat: any;

beforeAll(async () => {
  const response2 = await request(client).post('/api/v1/auth/login').send({ email: user.email, password: user.password });
  userToken = response2.body.accessToken;

  chat = await request(client)
    .get('/api/v1/chats')
    .set('Authorization', `Bearer ${userToken}`)
    .then(res => res.body.data[0]);
});

describe('Message', () => {
  it('should not create a message without message data', async () => {
    const response = await request(client).post(`/api/v1/messages`).set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(400);
  });

  it('should create a message', async () => {
    const response = await request(client)
      .post(`/api/v1/messages`)
      .send({ message: 'new message from user to tasker', chatId: chat._id })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('_id');
  });

  it('should get messages by chat id', async () => {
    const response = await request(client).get(`/api/v1/messages/chat/${chat._id}`).set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it('should delete a message', async () => {
    const response1 = await request(client).get(`/api/v1/messages/chat/${chat._id}`).set('Authorization', `Bearer ${userToken}`);

    const response2 = await request(client)
      .delete(`/api/v1/messages/${response1.body.data[0]._id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(response2.status).toBe(204);
  });
});
