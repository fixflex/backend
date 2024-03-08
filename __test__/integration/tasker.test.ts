import mongoose from 'mongoose';
import request from 'supertest';

import { server } from '../../src';
import ServiceModel from '../../src/DB/models/category.model';
import UserModel from '../../src/DB/models/user.model';
import { createAccessToken } from '../../src/helpers';

let token: string;
let service: any;
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
  server.close();
});

// create user before all tests
beforeAll(async () => {
  const user = await UserModel.create(newUserData);
  token = createAccessToken(user._id);
  // create service
  service = await ServiceModel.create({ name: { en: 'plumbing', ar: 'السباكة' } });
});

// afterEach(async () => {
//   await User.deleteMany({});
// });

describe('tasker', () => {
  describe('POST /api/v1/become-tasker', () => {
    it('should create a new tasker', async () => {
      const response = await request(server)
        .post('/api/v1/taskers/become-tasker')
        .set('Authorization', `Bearer ${token}`)
        .send({
          categories: [service._id],
          location: {
            coordinates: [31.185277, 27.174436],
          },
          phoneNumber: '01066042582',
        });
      taskerId = response.body.data._id;
      expect(response.status).toBe(201);
      expect(response.body.data.categories).toHaveLength(1);
    });
    // if no categories are provided
    it('should return 400 if no categories are provided', async () => {
      const response = await request(server)
        .post('/api/v1/taskers/become-tasker')
        .set('Authorization', `Bearer ${token}`)
        .send({ categories: [] });
      expect(response.status).toBe(400);
    });

    // if service id is not valid
    it('should return 404 if service id is not valid', async () => {
      const response = await request(server)
        .post('/api/v1/taskers/become-tasker')
        .set('Authorization', `Bearer ${token}`)
        .send({ categories: ['123'] });
      expect(response.status).toBe(400);
    });
    // if service id not found in DB
    it('should return 404 if service id not found in DB', async () => {
      const response = await request(server)
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
      const response = await request(server).post('/api/v1/taskers/become-tasker');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/taskers/:id', () => {
    it('should return a tasker by ID', async () => {
      const response = await request(server).get(`/api/v1/taskers/${taskerId}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data._id).toBe(taskerId.toString());
    });
    it('should return 404 if tasker not found', async () => {
      const response = await request(server).get('/api/v1/taskers/64f0d1196cbe0251ae16b092').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/v1/taskers', () => {
    it('should return all taskers', async () => {
      const response = await request(server).get('/api/v1/taskers').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });
  });
  // TODO: test filtering by service, location, rating, price

  describe('PATCH /api/v1/taskers/me', () => {
    it('should update tasker data', async () => {
      const response = await request(server)
        .patch('/api/v1/taskers/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ phoneNumber: '01066032844' });
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('DELETE /api/v1/taskers/me', () => {
    it('should delete tasker', async () => {
      const response = await request(server).delete('/api/v1/taskers/me').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(204);
    });
    it('should return 404 there is no tasker with this user id', async () => {
      const response = await request(server).delete('/api/v1/taskers/me').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(404);
    });
  });
});

// ##############################################################################################################
// ##############################################################################################################
// describe('user', () => {
//   describe('GET /api/v1/users/me', () => {
//     it('should return 200 and user data', async () => {
//       const response = await request(server).get('/api/v1/users/me').set('Authorization', `Bearer ${token}`);
//       expect(response.status).toBe(200);
//       expect(response.body.data).toBeDefined();
//     });
//     it('should return 401 if no token is provided', async () => {
//       const response = await request(server).get('/api/v1/users/me');
//       expect(response.status).toBe(401);
//     });
//   });

//   describe('PATCH /api/v1/users/me', () => {
//     it('should update user data', async () => {
//       const response = await request(server).patch('/api/v1/users/me').set('Authorization', `Bearer ${token}`).send({ firstName: 'ahmed' });
//       expect(response.status).toBe(200);
//       expect(response.body.data).toBeDefined();
//       expect(response.body.data.firstName).toBe('ahmed');
//     });
//   });

//   describe('PATCH /api/v1/users/me/profile-picture-upload', () => {
//     it('should update user profile picture', async () => {
//       const response = await request(server)
//         .patch('/api/v1/users/me/profile-picture-upload')
//         .set('Authorization', `Bearer ${token}`)
//         .attach('profilePicture', '__test__/testFiles/testImage.jpg');
//       await cloudinaryDeleteImage(response.body.data.profilePicture.publicId);
//       expect(response.status).toBe(200);
//       expect(response.body.data).toBeDefined();
//       expect(response.body.data.profilePicture.url).toMatch('https://res.cloudinary.com');
//       expect(response.body.data.profilePicture.publicId).toBeDefined();
//     });
//   });

//   describe('DELETE /api/v1/users/me', () => {
//     it('should delete user', async () => {
//       const response = await request(server).delete('/api/v1/users/me').set('Authorization', `Bearer ${token}`);
//       expect(response.status).toBe(204);
//     });
//   });
// });

// //##############################################################################################################
// //##############################################################################################################
// // it('should pass', () => {
// //   expect(1).toBe(1);
// // });

// //##############################################################################################################

// // describe('POST /api/v1/users', () => {
// //   it('should create a new user', async () => {
// //     const response = await request(server).post('/api/v1/users').set('Authorization', `Bearer ${token}`).send(newUserData);
// //     expect(response.status).toBe(201);
// //     expect(response.body.user).toBeDefined();
// //   });

// //   it('should return 409 if email already exists', async () => {
// //     // Create a user with the same email
// //     await User.create(newUserData);
// //     const response = await request(server).post('/api/v1/users').set('Authorization', `Bearer ${token}`).send(newUserData);

// //     expect(response.status).toBe(409);
// //     expect(response.body.message).toMatch('E-Mail address John@gmail.com is already exists');
// //   });

// //   it('should return 409 if username already exists', async () => {
// //     // Create a user with the same username
// //     await User.create(newUserData);

// //     const response = await request(server).post('/api/v1/users').set('Authorization', `Bearer ${token}`).send({
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
// //     const response = await request(server).post('/api/v1/users').set('Authorization', `Bearer ${token}`).send({
// //       name: 'John Doe',
// //       email: 'newEmail@gmail.com',
// //       username: 'JohnDoe',
// //       password: 'password123',
// //       confirmPassword: 'password',
// //     });
// //     expect(response.status).toBe(400);
// //   });

// //   it('should return 401 You are not authorized, if no token is provided', async () => {
// //     const response = await request(server).post('/api/v1/users').send(newUserData);
// //     expect(response.status).toBe(401);
// //     expect(response.body.message).toMatch('You are not authorized');
// //   });

// //   it('should return 403 if user is not an admin', async () => {
// //     const user = await User.create(newUserData);
// //     token = createAccessToken(user._id);

// //     const response = await request(server).post('/api/v1/users').set('Authorization', `Bearer ${token}`).send(newUserData);

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

// //     const response = await request(server).get('/api/v1/users').set('Authorization', `Bearer ${token}`);

// //     expect(response.status).toBe(200);
// //     expect(response.body.users).toHaveLength(3);
// //   });
// // });

// // describe('GET /api/v1/users/:id', () => {
// //   it('should return a user by ID', async () => {
// //     // Create a user
// //     const createdUser = await User.create(newUserData);

// //     const response = await request(server).get(`/api/v1/users/${createdUser._id}`).set('Authorization', `Bearer ${token}`);

// //     expect(response.status).toBe(200);
// //     expect(response.body.user).toBeDefined();
// //     expect(response.body.user._id).toBe(createdUser._id.toString());
// //   });

// //   it('should return 404 if user not found', async () => {
// //     const response = await request(server).get('/api/v1/users/64f0d1196cbe0251ae16b092').set('Authorization', `Bearer ${token}`);

// //     expect(response.status).toBe(404);
// //     expect(response.body.message).toBeDefined();
// //   });
// // });

// // describe('PUT /api/v1/users/:id', () => {
// //   it('should update a user', async () => {
// //     // Create a user
// //     const createdUser = await User.create(newUserData);

// //     const response = await request(server).put(`/api/v1/users/${createdUser._id}`).set('Authorization', `Bearer ${token}`).send({
// //       name: 'Updated Name',
// //     });

// //     expect(response.status).toBe(200);
// //     expect(response.body.user).toBeDefined();
// //     expect(response.body.user._id).toBe(createdUser._id.toString());
// //     expect(response.body.user.name).toBe('Updated Name');
// //   });

// //   it('should return 404 if user not found', async () => {
// //     const response = await request(server).put('/api/v1/users/64f0d1196cbe0251ae16b092').set('Authorization', `Bearer ${token}`).send({
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

// //     const response = await request(server).delete(`/api/v1/users/${createdUser._id}`).set('Authorization', `Bearer ${token}`);

// //     expect(response.status).toBe(204);
// //     expect(response.text).toBe('');
// //   });

// //   it('should return 404 if user not found', async () => {
// //     const response = await request(server).delete('/api/v1/users/64e3cb9978ed3b58c9b3a653').set('Authorization', `Bearer ${token}`);

// //     expect(response.status).toBe(404);
// //     expect(response.body.message).toBeDefined();
// //   });
// // });

// // describe('PUT /api/v1/users/profile-picture-upload/:id', () => {
// //   it('should update a user profile picture', async () => {
// //     // Create a user
// //     const user = await User.create(newUserData);

// //     const response = await request(server)
// //       .put(`/api/v1/users/profile-picture-upload/${user._id}`)
// //       .set('Authorization', `Bearer ${token}`)
// //       .attach('profilePicture', 'src/__test__/integration/testFiles/testImage.jpg');
// //     await cloudinaryDeleteImage(response.body.user.profilePicture.publicId);
// //     expect(response.status).toBe(200);
// //     expect(response.body.user.profilePicture.url).toMatch('https://res.cloudinary.com');
// //     expect(response.body.user.profilePicture.publicId).toBeDefined();
// //   });
// // });
