// import mongoose from 'mongoose';
import request from 'supertest';

import { client } from '../../src';
import { cloudinaryDeleteImage } from '../../src/helpers';
import { user } from '../data';

let token: string;
beforeAll(async () => {
  // login to get the accessToken
  const response = await request(client).post('/api/v1/auth/login').send({ email: user.email, password: user.password });
  token = response.body.accessToken;
})


describe('User', () => {

  describe('GET /api/v1/users/me', () => {
    it('should return 200 and user data', async () => {
      const response = await request(client).get('/api/v1/users/me').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
    it('should return 401 if no token is provided', async () => {
      const response = await request(client).get('/api/v1/users/me');
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/v1/users/me', () => {
    it('should update user data', async () => {
      const response = await request(client).patch('/api/v1/users/me').set('Authorization', `Bearer ${token}`).send({ firstName: user.firstName });
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('PATCH /api/v1/users/me/profile-picture', () => {
    it('should update user profile picture', async () => {
      const response = await request(client)
        .patch('/api/v1/users/me/profile-picture')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', '__test__/testFiles/testImage.jpg');
      const response2 = await cloudinaryDeleteImage(response.body.data.profilePicture.publicId);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.profilePicture.url).toMatch('https://res.cloudinary.com');
      expect(response.body.data.profilePicture.publicId).toBeDefined();
      expect(response2.result).toBe('ok');
    }, 10000);
  });

  // describe('DELETE /api/v1/users/me', () => {
  //   it('should delete user', async () => {
  //     const response = await request(client).delete('/api/v1/users/me').set('Authorization', `Bearer ${token}`);
  //     expect(response.status).toBe(204);
  //   });
  // });

  // this.router.get(`${this.path}/send-verification-code`, authenticateUser, this.userController.sendVerificationCode);
  // this.router.post(`${this.path}/verify`, authenticateUser, this.userController.verifyCode);

  //   describe('api/v1/users/[send-verification-code, verify]', () => {
  //     it('should return 200 and send verification code', async () => {
  //       const response = await request(client).get('/api/v1/users/send-verification-code').set('Authorization', `Bearer ${token}`);
  //       expect(response.status).toBe(200);
  //       expect(response.body.message).toBeDefined();
  //     });

  //     it('should return 200 and verify code', async () => {
  //       const response = await request(client).post('/api/v1/users/verify').set('Authorization', `Bearer ${token}`).send({ verificationCode: '123456' });
  //       expect(response.status).toBe(200);
  //       expect(response.body.message).toBeDefined();
  //     });
  //   });

});



// //##############################################################################################################
// //##############################################################################################################
// //##############################################################################################################
// //##############################################################################################################



// //   it('should return 409 if email already exists', async () => {
// //     // Create a user with the same email
// //     await User.create(newUserData);
// //     const response = await request(client).post('/api/v1/users').set('Authorization', `Bearer ${token}`).send(newUserData);

// //     expect(response.status).toBe(409);
// //     expect(response.body.message).toMatch('E-Mail address John@gmail.com is already exists');
// //   });

// //   it('should return 409 if username already exists', async () => {
// //     // Create a user with the same username
// //     await User.create(newUserData);

// //     const response = await request(client).post('/api/v1/users').set('Authorization', `Bearer ${token}`).send({
// //       name: 'John Doe',
// //       email: 'newEmail@gmail.com',
// //       username: 'JohnDoe',
// //       password: 'password123',
// //       confirmPassword: 'password123',
// //     });

// //     expect(response.status).toBe(409);
// //     expect(response.body.message).toMatch('Username already in use');
// //   });

// //   it('should return 400 if password and confirmPassword do not match', async () => {
// //     const response = await request(client).post('/api/v1/users').set('Authorization', `Bearer ${token}`).send({
// //       name: 'John Doe',
// //       email: 'newEmail@gmail.com',
// //       username: 'JohnDoe',
// //       password: 'password123',
// //       confirmPassword: 'password',
// //     });
// //     expect(response.status).toBe(400);
// //   });

// //   it('should return 401 You are not authorized, if no token is provided', async () => {
// //     const response = await request(client).post('/api/v1/users').send(newUserData);
// //     expect(response.status).toBe(401);
// //     expect(response.body.message).toMatch('You are not authorized');
// //   });

// //   it('should return 403 if user is not an admin', async () => {
// //     const user = await User.create(newUserData);
// //     token = createAccessToken(user._id);

// //     const response = await request(client).post('/api/v1/users').set('Authorization', `Bearer ${token}`).send(newUserData);

// //     expect(response.status).toBe(403);
// //   });
// // });

// // describe('GET /api/v1/users', () => {
// //   it('should return all users', async () => {
// //     // Create some users
// //     await User.create([
// //       {
// //         name: 'John Doe',
// //         email: 'john@example.com',
// //         username: 'johndoe',
// //         password: 'password123',
// //       },
// //       {
// //         name: 'Jane Doe',
// //         email: 'jane@example.com',
// //         username: 'janedoe',
// //         password: 'password456',
// //         confirmPassword: 'password456',
// //       },
// //     ]);

// //     const response = await request(client).get('/api/v1/users').set('Authorization', `Bearer ${token}`);

// //     expect(response.status).toBe(200);
// //     expect(response.body.users).toHaveLength(3);
// //   });
// // });

// // describe('GET /api/v1/users/:id', () => {
// //   it('should return a user by ID', async () => {
// //     // Create a user
// //     const createdUser = await User.create(newUserData);

// //     const response = await request(client).get(`/api/v1/users/${createdUser._id}`).set('Authorization', `Bearer ${token}`);

// //     expect(response.status).toBe(200);
// //     expect(response.body.user).toBeDefined();
// //     expect(response.body.user._id).toBe(createdUser._id.toString());
// //   });

// //   it('should return 404 if user not found', async () => {
// //     const response = await request(client).get('/api/v1/users/64f0d1196cbe0251ae16b092').set('Authorization', `Bearer ${token}`);

// //     expect(response.status).toBe(404);
// //     expect(response.body.message).toBeDefined();
// //   });
// // });

// // describe('PUT /api/v1/users/:id', () => {
// //   it('should update a user', async () => {
// //     // Create a user
// //     const createdUser = await User.create(newUserData);

// //     const response = await request(client).put(`/api/v1/users/${createdUser._id}`).set('Authorization', `Bearer ${token}`).send({
// //       name: 'Updated Name',
// //     });

// //     expect(response.status).toBe(200);
// //     expect(response.body.user).toBeDefined();
// //     expect(response.body.user._id).toBe(createdUser._id.toString());
// //     expect(response.body.user.name).toBe('Updated Name');
// //   });

// //   it('should return 404 if user not found', async () => {
// //     const response = await request(client).put('/api/v1/users/64f0d1196cbe0251ae16b092').set('Authorization', `Bearer ${token}`).send({
// //       name: 'Updated Name',
// //     });

// //     expect(response.status).toBe(404);
// //     expect(response.body.message).toBe('No user found');
// //   });
// // });

// // describe('DELETE /api/v1/users/:id', () => {
// //   it('should delete a user', async () => {
// //     // Create a user
// //     const createdUser = await User.create(newUserData);

// //     const response = await request(client).delete(`/api/v1/users/${createdUser._id}`).set('Authorization', `Bearer ${token}`);

// //     expect(response.status).toBe(204);
// //     expect(response.text).toBe('');
// //   });

// //   it('should return 404 if user not found', async () => {
// //     const response = await request(client).delete('/api/v1/users/64e3cb9978ed3b58c9b3a653').set('Authorization', `Bearer ${token}`);

// //     expect(response.status).toBe(404);
// //     expect(response.body.message).toBeDefined();
// //   });
// // });

// // describe('PUT /api/v1/users/profile-picture-upload/:id', () => {
// //   it('should update a user profile picture', async () => {
// //     // Create a user
// //     const user = await User.create(newUserData);

// //     const response = await request(client)
// //       .put(`/api/v1/users/profile-picture-upload/${user._id}`)
// //       .set('Authorization', `Bearer ${token}`)
// //       .attach('profilePicture', 'src/__test__/integration/testFiles/testImage.jpg');
// //     await cloudinaryDeleteImage(response.body.user.profilePicture.publicId);
// //     expect(response.status).toBe(200);
// //     expect(response.body.user.profilePicture.url).toMatch('https://res.cloudinary.com');
// //     expect(response.body.user.profilePicture.publicId).toBeDefined();
// //   });
// // });

