import mongoose from 'mongoose';
import request from 'supertest';

import { client as app } from '../../src/';
// import { app } from '../../src';
import User from '../../src/DB/models/user.model';

// let app = App.getServer();

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  //   app.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

const newUserData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'John@example.com',
  password: 'password123',
};

describe('Authentication', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('should return 201 and create new user', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send(newUserData);
      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
      // expect(response.body.token).toBeDefined();
    });

    it('should return 409 E-Mail address is already exists', async () => {
      await request(app).post('/api/v1/auth/signup').send(newUserData);
      const response = await request(app).post('/api/v1/auth/signup').send(newUserData);

      expect(response.status).toBe(409);
      expect(response.body.message).toBeDefined();
    });

    it('fails signup without required fields', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send({ firstName: newUserData.firstName, email: newUserData.email });

      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('can log in with email', async () => {
      await request(app).post('/api/v1/auth/signup').send(newUserData);
      const response = await request(app).post('/api/v1/auth/login').send({ email: newUserData.email, password: newUserData.password });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      // expect(response.body.token).toBeDefined();
    });

    it('should return 401 Incorrect email or password`', async () => {
      await request(app).post('/api/v1/auth/signup').send(newUserData);
      const response = await request(app).post('/api/v1/auth/login').send({ email: newUserData.email, password: 'wrongPassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it('fails login without required fields', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send({ name: newUserData.firstName, email: newUserData.email });

      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
  describe('GET /api/v1/auth/refresh-token', () => {
    it('should return 401 Unauthorized', async () => {
      const response = await request(app).get('/api/v1/auth/refresh-token');

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it('should return 200 and refresh token', async () => {
      await request(app).post('/api/v1/auth/signup').send(newUserData);
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: newUserData.email, password: newUserData.password });
      const response = await request(app).get('/api/v1/auth/refresh-token').set('Cookie', loginResponse.header['set-cookie']);

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
    });
  });

  // this.router.post(`${this.path}/forgot-password`, this.authController.forgotPassword);

  // this.router.post(`${this.path}/verify-reset-code`, this.authController.verifyPassResetCode);

  // this.router.patch(`${this.path}/reset-password`, this.authController.resetPassword);

  // this.router.patch(`${this.path}/change-password`, changePasswordValidator, this.authController.changePassword);

  /**
   *   public forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    let { email } = req.body;
    await this.authService.forgotPassword(email);
    res.status(200).json(customResponse({ data: null, success: true, message: req.t('reset_code_sent') }));
  });

  public verifyPassResetCode = asyncHandler(async (req: Request, res: Response) => {
    let { resetCode } = req.body;
    await this.authService.verifyPassResetCode(resetCode);
    res.status(200).json(customResponse({ data: null, success: true, message: req.t('reset_code_verified') }));
  });

  public resetPassword = asyncHandler(async (req: Request, res: Response) => {
    let { email, newPassword } = req.body;
    let results = await this.authService.resetPassword(email, newPassword);

    res.cookie('access_token', results.accessToken, this.accessTokenCookieOptions);
    res.cookie('refresh_token', results.refreshToken, this.refreshTokenCookieOptions);

    res
      .status(200)
      .json(
        customResponse(Object.assign({ data: null, success: true, message: req.t('password_reset') }, { accessToken: results.accessToken }))
      );
  });

  public changePassword = asyncHandler(async (req: Request, res: Response) => {
    let { token } = await this.authService.changePassword(req.body as { oldPassword: string; newPassword: string }, req.user!);
    res.cookie('access_token', token, this.accessTokenCookieOptions);

    res
      .status(200)
      .json(customResponse(Object.assign({ data: null, success: true, message: req.t('password_changed') }, { accessToken: token })));
  });
   */

  //   describe('POST /api/v1/auth/forgot-password', () => {
  //     it('should return 200 and send reset code', async () => {
  //       await request(app).post('/api/v1/auth/signup').send(newUserData);
  //       const response = await request(app).post('/api/v1/auth/forgot-password').send({ email: newUserData.email });

  //       expect(response.status).toBe(200);
  //       expect(response.body.message).toBeDefined();
  //     });

  //     it('should return 404 User not found', async () => {
  //       const response = await request(app).post('/api/v1/auth/forgot-password').send({ email: newUserData.email });

  //       expect(response.status).toBe(404);
  //       expect(response.body.message).toBeDefined();
  //     });
  //   });

  //   describe('POST /api/v1/auth/verify-reset-code', () => {
  //     it('should return 200 and verify reset code', async () => {
  //       await request(app).post('/api/v1/auth/signup').send(newUserData);
  //       const forgotPasswordResponse = await request(app).post('/api/v1/auth/forgot-password').send({ email: newUserData.email });
  //       const response = await request(app).post('/api/v1/auth/verify-reset-code').send({ resetCode: forgotPasswordResponse.body.resetCode });

  //       expect(response.status).toBe(200);
  //       expect(response.body.message).toBeDefined();
  //     });
  //   });

  //   describe('PATCH /api/v1/auth/reset-password', () => {
  //     it('should return 200 and reset password', async () => {
  //       await request(app).post('/api/v1/auth/signup').send(newUserData);
  //       const forgotPasswordResponse = await request(app).post('/api/v1/auth/forgot-password').send({ email: newUserData.email });
  //       await request(app).post('/api/v1/auth/verify-reset-code').send({ resetCode: forgotPasswordResponse.body.resetCode });
  //       const response = await request(app)
  //         .patch('/api/v1/auth/reset-password')
  //         .send({ email: newUserData.email, newPassword: 'newPassword123' });

  //       expect(response.status).toBe(200);
  //       expect(response.body.message).toBeDefined();
  //     });

  //     it('should return 404 User not found', async () => {
  //       const response = await request(app)
  //         .patch('/api/v1/auth/reset-password')
  //         .send({ email: newUserData.email, newPassword: 'newPassword123' });

  //       expect("response.status").toBe(404);
  //       expect("response.body.message").toBeDefined();
  //     });
  //   });
});
