"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_swagger_1 = require("./auth.swagger");
const health_swagger_1 = require("./health.swagger");
const offers_swagger_1 = require("./offers.swagger");
const taskers_swagger_1 = require("./taskers.swagger");
const tasks_swagger_1 = require("./tasks.swagger");
const users_swagger_1 = require("./users.swagger");
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
                    default: 'https://fixflex.onrender.com',
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
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                in: 'header',
                bearerFormat: 'JWT',
                description: '**Note** You can provide access token either through the Bearer Authorization header or cookies. Upon login or signup, the `access_token` and `refresh_token` will be set automatically and sent with each request.',
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
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
            delete: users_swagger_1.deleteMe,
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
        '/tasks': {
            get: tasks_swagger_1.getTasks,
            post: tasks_swagger_1.createTask,
        },
        '/tasks/{taskId}': {
            get: tasks_swagger_1.getTask,
            patch: tasks_swagger_1.updateTask,
            delete: tasks_swagger_1.deleteTask,
        },
        '/tasks/{taskId}/images': {
            patch: tasks_swagger_1.uploadTaskImages,
        },
        '/tasks/{taskId}/open': {
            patch: tasks_swagger_1.openTask,
        },
        '/tasks/{taskId}/cancel': {
            patch: tasks_swagger_1.cancelTask,
        },
        'tasks/{taskId}/complete': {
            patch: tasks_swagger_1.completeTask,
        },
        // *************** Offers *************** //
        '/offers': {
            // get: getOffers,
            post: offers_swagger_1.createOffer,
        },
        '/offers/{offerId}': {
            get: offers_swagger_1.getOfferById,
            patch: offers_swagger_1.updateOffer,
            delete: offers_swagger_1.deleteOffer,
        },
        // *************** Categories *************** //
        // '/categories': {},
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
