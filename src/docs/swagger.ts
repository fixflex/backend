import { changePassword, forgotPassword, googleSignIn, login, logout, refreshToken, resetPassword, signup, verifyResetCode } from './auth.swagger';
import { healthz } from './health.swagger';
import { becomeTasker, getMyTaskerProfile, getTasker, getTaskers, updateMyTaskerProfile } from './taskers.swagger';
import { getMe, updateMe, updateProfileImage } from './users.swagger';

const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'khidma API',
    description: 'API for khidam Application',
    contact: {
      name: 'Ahmed Mostafa',
      url: 'https://github.com/AhmedElasiriy',
      email: 'ahmed.elasiriy@gmail.com',
    },
    version: '1.0.0',
  },
  schemes: ['http', 'https'],
  servers: [
    {
      url: '{serverUrl}/api/{apiVersion}',
      variables: {
        serverUrl: {
          default: 'https://khidma.onrender.com',
          enum: ['https://khidma.onrender.com', 'http://localhost:8080'],
        },
        apiVersion: {
          default: 'v1',
        },
      },
    },
  ],

  components: {
    securitySchemes: {
      // cookieAuth: {
      //   type: 'apiKey', // type is apiKey since we use a cookie
      //   in: 'cookie',
      //   name: 'access_token', // Update the cookie name if needed
      // },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT',
        description:
          'Optional. You can provide access token either through the Bearer Authorization header or cookies. Upon login or signup, the access_token and refresh_token will be set automatically and sent with each request.',
      },
    },
    security: [
      // {
      //   cookieAuth: [], // Use the new cookieAuth scheme for security
      // },
      {
        bearerAuth: [],
      },
    ],
  },

  // components: {
  //   securitySchemes: {
  // bearerAuth: {
  //   type: 'http',
  //   scheme: 'bearer',
  //   in: 'header',
  //   bearerFormat: 'JWT',
  // },
  //   },
  // },
  // security: [
  //   {
  //     jwt: [],
  //   },
  // ],
  paths: {
    // *************** Health *************** //

    '/healthz': {
      get: healthz,
    },

    // *************** Auth *************** //

    '/auth/signup': {
      post: signup,
    },
    '/auth/login': {
      post: login,
    },
    '/auth/logout': {
      post: logout,
    },
    '/auth/google': {
      post: googleSignIn,
    },
    '/auth/refresh-token': {
      get: refreshToken,
    },
    '/auth/forgot-password': {
      post: forgotPassword,
    },
    '/auth/verify-reset-code': {
      post: verifyResetCode,
    },
    '/auth/reset-password': {
      post: resetPassword,
    },
    '/auth/change-password': {
      patch: changePassword,
    },

    // *************** Users *************** //

    '/users/me': {
      get: getMe,
      patch: updateMe,
      // delete: {},
    },
    '/users/me/profile-picture': {
      patch: updateProfileImage,
    },
    // *************** Tasker *************** //

    '/taskers/{userId}': {
      get: getTasker,
    },

    '/taskers': {
      get: getTaskers,
    },

    '/taskers/become-tasker': {
      post: becomeTasker,
    },

    '/taskers/me': {
      get: getMyTaskerProfile,
      patch: updateMyTaskerProfile,
      // delete: {},
    },

    // *************** Tasks *************** //
    // *************** Locations *************** //
    // *************** Reviews *************** //
    // *************** Categories *************** //
    // *************** Services *************** //
    // *************** Orders *************** //
    // *************** Reviews *************** //
    // *************** Payments *************** //
    // *************** Notifications *************** //
    // *************** Settings *************** //
    // *************** Admin *************** //
  },
};

export default swaggerDocument;
