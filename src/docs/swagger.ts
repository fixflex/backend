import { changePassword, forgotPassword, googleSignIn, login, logout, refreshToken, resetPassword, signup, verifyResetCode } from './auth.swagger';
import { healthz } from './health.swagger';
import { becomeTasker, getMyTaskerProfile, getTasker, getTaskers, updateMyTaskerProfile } from './taskers.swagger';
import { getMe, updateMe, updateProfileImage } from './users.swagger';

const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'fixflex API',
    description: 'REST API for fixflex',
    contact: {
      name: 'Ahmed Mostafa',
      // url: 'https://github.com/AhmedElasiriy',
      email: 'ahmed.elasiriy@gmail.com',
    },
    version: '1.0.0',
    // /**Note*/ that you can pass the accept-language parameter in the header or in the cookie.\n if you don't pass it, it will take the default language which is english.\n if you pass it in the header, the value must be a valid language code like en, ar, fr, etc.\n if you pass it in the cookie, the key must be accept-language and the value must be a valid language code like en, ar .
  },
  schemes: ['http', 'https'],
  servers: [
    {
      url: '{serverUrl}/api/{apiVersion}',
      variables: {
        serverUrl: {
          default: 'http://localhost:8080',
          enum: ['https://fixflex.onrender.com', 'http://localhost:8080'],
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
          '**Note** You can provide access token either through the Bearer Authorization header or cookies. Upon login or signup, the `access_token` and `refresh_token` will be set automatically and sent with each request.',
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
