"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMe = exports.updateProfileImage = exports.updateMe = exports.getMe = void 0;
exports.getMe = {
    security: [{ bearerAuth: [] }],
    tags: ['Users'],
    description: "Get the current user's data",
    opeationId: 'getMe',
    parameters: [
        {
            in: 'header',
            name: 'accept-language',
            type: 'string',
            example: 'ar',
        },
    ],
    responses: {
        200: {
            description: 'Get Users',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: true,
                            },
                            status: {
                                type: 'integer',
                                example: 200,
                            },
                            message: {
                                type: 'string',
                                example: 'Users found',
                            },
                            data: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'integer',
                                        example: 1,
                                    },
                                    firstName: {
                                        type: 'string',
                                        example: 'John',
                                    },
                                    lastName: {
                                        type: 'string',
                                        example: 'Doe',
                                    },
                                    email: {
                                        type: 'string',
                                        example: 'user@gmail.com',
                                    },
                                    profilePicture: {
                                        type: 'string',
                                        example1: null,
                                        example: 'https://res.cloudinary.com/dknma8cck/image/upload/v1629291909/EcommerceAPI/Users/admin/xxcrbfkwglqa5c5kay4u.webp',
                                    },
                                    active: {
                                        type: 'boolean',
                                        example: true,
                                    },
                                    emailVerified: {
                                        type: 'boolean',
                                        example: true,
                                    },
                                    createdAt: {
                                        type: 'string',
                                        example: '2021-05-08T13:14:01.000Z',
                                    },
                                    updatedAt: {
                                        type: 'string',
                                        example: '2021-05-08T13:14:01.000Z',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        401: {
            description: 'Unauthorized',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: false,
                            },
                            error: {
                                type: 'boolean',
                                example: true,
                            },
                            status: {
                                type: 'integer',
                                example: 401,
                            },
                            message: {
                                type: 'string',
                                example: 'You are not authorized, you must login to get access this route',
                            },
                            data: {
                                type: 'null',
                                example: null,
                            },
                        },
                    },
                },
            },
        },
    },
};
exports.updateMe = {
    security: [{ bearerAuth: [] }],
    tags: ['Users'],
    description: 'This route allow logged in user to update his own profile details',
    opeationId: 'updateUserDetails',
    parameters: [
        {
            in: 'header',
            name: 'accept-language',
            type: 'string',
            example: 'ar',
        },
    ],
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        firstName: {
                            type: 'string',
                            example: 'John',
                        },
                        lastName: {
                            type: 'string',
                            example: 'Doe',
                        },
                        email: {
                            type: 'string',
                            example: 'user@gmail.com',
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Update user details',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: true,
                            },
                            message: {
                                type: 'string',
                                example: 'Users details updated',
                            },
                            data: {
                                type: 'object',
                                properties: {
                                    _id: {
                                        type: 'string',
                                        example: '611d08a62fc210a30ecfb75b',
                                    },
                                    firstName: {
                                        type: 'string',
                                        example: 'Ahmed',
                                    },
                                    lastName: {
                                        type: 'string',
                                        example: 'Elasiriy',
                                    },
                                    email: {
                                        type: 'string',
                                        example: 'user@gmail.com',
                                    },
                                    profilePicture: {
                                        type: 'string',
                                        example1: null,
                                        example: 'https://res.cloudinary.com/dknma8cck/image/upload/v1629291909/EcommerceAPI/Users/admin/xxcrbfkwglqa5c5kay4u.webp',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        400: {
            description: 'Error: 400',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            errors: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        type: {
                                            type: 'string',
                                            example: 'field',
                                        },
                                        value: {
                                            type: 'string',
                                            example: 'password123',
                                        },
                                        msg: {
                                            type: 'string',
                                            example: 'Cannot change password from here, please go to update password route',
                                        },
                                        path: {
                                            type: 'string',
                                            example: 'password',
                                        },
                                        location: {
                                            type: 'string',
                                            example: 'body',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        401: {
            description: 'Error: 401',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: false,
                            },
                            status: {
                                type: 'number',
                                example: 401,
                            },
                            error: {
                                type: 'boolean',
                                example: true,
                            },
                            message: {
                                type: 'string',
                                example: 'You are not authorized, you must login to get access this route',
                            },
                            data: {
                                type: 'object',
                                example: null,
                            },
                        },
                    },
                },
            },
        },
        409: {
            description: 'Error: 409',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: false,
                            },
                            status: {
                                type: 'number',
                                example: 409,
                            },
                            error: {
                                type: 'boolean',
                                example: true,
                            },
                            message: {
                                type: 'string',
                                example: 'This Email Is Already Taken: {email}',
                            },
                            data: {
                                type: 'object',
                                example: null,
                            },
                        },
                    },
                },
            },
        },
    },
};
exports.updateProfileImage = {
    security: [{ bearerAuth: [] }],
    tags: ['Users'],
    description: 'This route allow logged in user to update his own profile image',
    opeationId: 'updateProfileImage',
    parameters: [
        {
            in: 'header',
            name: 'accept-language',
            type: 'string',
            example: 'ar',
        },
    ],
    requestBody: {
        required: true,
        content: {
            'multipart/form-data': {
                schema: {
                    type: 'object',
                    properties: {
                        profilePicture: {
                            type: 'string',
                            format: 'binary',
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Update user profile image',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: true,
                            },
                            message: {
                                type: 'string',
                                example: 'Users profile image updated',
                            },
                            data: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'integer',
                                        example: 1,
                                    },
                                    firstName: {
                                        type: 'string',
                                        example: 'John',
                                    },
                                    lastName: {
                                        type: 'string',
                                        example: 'Doe',
                                    },
                                    email: {
                                        type: 'string',
                                        example: 'user@gmail.com',
                                    },
                                    profilePicture: {
                                        type: 'string',
                                        example1: null,
                                        example: 'https://res.cloudinary.com/dknma8cck/image/upload/v1629291909/EcommerceAPI/Users/admin/xxcrbfkwglqa5c5kay4u.webp',
                                    },
                                    active: {
                                        type: 'boolean',
                                        example: true,
                                    },
                                    emailVerified: {
                                        type: 'boolean',
                                        example: true,
                                    },
                                    createdAt: {
                                        type: 'string',
                                        example: '2021-05-08T13:14:01.000Z',
                                    },
                                    updatedAt: {
                                        type: 'string',
                                        example: '2021-05-08T13:14:01.000Z',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        401: {
            description: 'Error: 401',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: false,
                            },
                            status: {
                                type: 'number',
                                example: 401,
                            },
                            error: {
                                type: 'boolean',
                                example: true,
                            },
                            message: {
                                type: 'string',
                                example: 'You are not authorized, you must login to get access this route',
                            },
                            data: {
                                type: 'object',
                                example: null,
                            },
                        },
                    },
                },
            },
        },
        400: {
            description: 'Error: 400',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: false,
                            },
                            status: {
                                type: 'number',
                                example: 400,
                            },
                            error: {
                                type: 'boolean',
                                example: true,
                            },
                            message: {
                                type: 'string',
                                example: 'Not an image! Please upload only images',
                            },
                            data: {
                                type: 'object',
                                example: null,
                            },
                        },
                    },
                },
            },
        },
        413: {
            description: 'Error: 413',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: false,
                            },
                            status: {
                                type: 'number',
                                example: 413,
                            },
                            error: {
                                type: 'boolean',
                                example: true,
                            },
                            message: {
                                type: 'string',
                                example: 'File too large.',
                            },
                            data: {
                                type: 'object',
                                example: null,
                            },
                        },
                    },
                },
            },
        },
    },
};
exports.deleteMe = {
    security: [{ bearerAuth: [] }],
    tags: ['Users'],
    description: 'This route allow logged in user to update his own profile details',
    opeationId: 'updateUserDetails',
    parameters: [
        {
            in: 'header',
            name: 'accept-language',
            type: 'string',
            example: 'ar',
        },
    ],
    responses: {
        200: {
            description: 'Delete user account',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: true,
                            },
                            message: {
                                type: 'string',
                                example: 'Users account deleted',
                            },
                            data: {
                                type: 'object',
                                example: null,
                            },
                        },
                    },
                },
            },
        },
        401: {
            description: 'Error: 401',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example1: false,
                                example: true,
                            },
                            status: {
                                type: 'number',
                                example: 401,
                            },
                            error: {
                                type: 'boolean',
                                example1: false,
                                example: true,
                            },
                            message: {
                                type: 'string',
                                example: 'You are not authorized, you must login to get access this route',
                            },
                            data: {
                                type: 'object',
                                example: null,
                            },
                        },
                    },
                },
            },
        },
    },
};
