import { forgotPassword, googleSignIn, login, logout, refreshToken, signup } from './auth.swagger';

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
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      jwt: [],
    },
  ],
  paths: {
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
    'forgot-password': {
      post: forgotPassword,
    },
  },
};

export default swaggerDocument;
