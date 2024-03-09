import mongoose from 'mongoose';
import request from 'supertest';

import UserModel from '../../src/DB/models/user.model';
// import the express app class and pass the routes to it in the constructor to initialize the app
import App from '../../src/app';
import { cloudinaryDeleteImage } from '../../src/helpers';
import { createAccessToken } from '../../src/helpers';

let app = App.getServer();

let token: string;

const newUserData = {
  firstName: 'john',
  lastName: 'doe',
  email: 'john@gmail.com',
  password: 'password',
};

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  // app.close();
});

// create user before all tests
beforeAll(async () => {
  const user = await UserModel.create(newUserData);
  token = createAccessToken(user._id);
});

// afterEach(async () => {
//   await User.deleteMany({});
// });

describe('user', () => {
  describe('GET /api/v1/users/me', () => {
    it('should return 200 and user data', async () => {
      const response = await request(app).get('/api/v1/users/me').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/api/v1/users/me');
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/v1/users/me', () => {
    it('should update user data', async () => {
      const response = await request(app).patch('/api/v1/users/me').set('Authorization', `Bearer ${token}`).send({ firstName: 'ahmed' });
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.firstName).toBe('ahmed');
    });
  });

  describe('PATCH /api/v1/users/me/profile-picture', () => {
    it('should update user profile picture', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me/profile-picture')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', '__test__/testFiles/testImage.jpg');
      await cloudinaryDeleteImage(response.body.data.profilePicture.publicId);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.profilePicture.url).toMatch('https://res.cloudinary.com');
      expect(response.body.data.profilePicture.publicId).toBeDefined();
    }, 10000);
  });
});
