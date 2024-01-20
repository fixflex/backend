"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_swagger_1 = require("./auth.swagger");
const health_swagger_1 = require("./health.swagger");
const taskers_swagger_1 = require("./taskers.swagger");
const users_swagger_1 = require("./users.swagger");
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
                description: 'Optional. You can provide access token either through the Bearer Authorization header or cookies. Upon login or signup, the access_token and refresh_token will be set automatically and sent with each request.',
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
            get: health_swagger_1.healthz,
        },
        // *************** Auth *************** //
        '/auth/signup': {
            post: auth_swagger_1.signup,
        },
        '/auth/login': {
            post: auth_swagger_1.login,
        },
        '/auth/logout': {
            post: auth_swagger_1.logout,
        },
        '/auth/google': {
            post: auth_swagger_1.googleSignIn,
        },
        '/auth/refresh-token': {
            get: auth_swagger_1.refreshToken,
        },
        '/auth/forgot-password': {
            post: auth_swagger_1.forgotPassword,
        },
        '/auth/verify-reset-code': {
            post: auth_swagger_1.verifyResetCode,
        },
        '/auth/reset-password': {
            post: auth_swagger_1.resetPassword,
        },
        '/auth/change-password': {
            patch: auth_swagger_1.changePassword,
        },
        // *************** Users *************** //
        '/users/me': {
            get: users_swagger_1.getMe,
            patch: users_swagger_1.updateMe,
            // delete: {},
        },
        '/users/me/profile-picture': {
            patch: users_swagger_1.updateProfileImage,
        },
        // *************** Tasker *************** //
        '/taskers/{userId}': {
            get: taskers_swagger_1.getTasker,
        },
        '/taskers': {
            get: taskers_swagger_1.getTaskers,
        },
        '/taskers/become-tasker': {
            post: taskers_swagger_1.becomeTasker,
        },
        '/taskers/me': {
            get: taskers_swagger_1.getMyTaskerProfile,
            patch: taskers_swagger_1.updateMyTaskerProfile,
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
exports.default = swaggerDocument;
