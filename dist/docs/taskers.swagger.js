"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMyTaskerProfile = exports.getMyTaskerProfile = exports.becomeTasker = exports.getTaskers = exports.getTasker = void 0;
exports.getTasker = {
    tags: ['Taskers'],
    description: 'Get Tasker',
    operationId: 'getTasker',
    parameters: [
        {
            name: 'taskerId',
            in: 'path',
            description: 'tasker id',
            required: true,
            schema: {
                type: 'string',
            },
        },
        {
            in: 'header',
            name: 'accept-language',
            type: 'string',
        },
    ],
    responses: {
        200: {
            description: 'Tasker',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: true,
                            },
                            error: {
                                type: 'boolean',
                                example: false,
                            },
                            message: {
                                type: 'string',
                                example: 'Tasker found',
                            },
                            status: {
                                type: 'number',
                                example: 200,
                            },
                            data: {
                                type: 'object',
                                properties: {
                                    _id: {
                                        type: 'string',
                                        example: '6560fc346f972e1d74a7125d',
                                    },
                                    userId: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '6560f8056f972e1d74a71226',
                                            },
                                            firstName: {
                                                type: 'string',
                                                example: 'user',
                                            },
                                            lastName: {
                                                type: 'string',
                                                example: '1',
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
                                    categories: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                _id: {
                                                    type: 'string',
                                                    example: '6560fabd6f972e1d74a71242',
                                                },
                                                name: {
                                                    type: 'string',
                                                    example: 'نجار',
                                                },
                                            },
                                        },
                                    },
                                    rating: {
                                        type: 'number',
                                        example: 0,
                                    },
                                    completedTasks: {
                                        type: 'number',
                                        example: 0,
                                    },
                                    // location: {
                                    //     type: 'object',
                                    //     properties: {
                                    //         coordinates: {
                                    //             type: 'array',
                                    //             items: {
                                    //                 type: 'number',
                                    //                 example: 31.815193,
                                    //             },
                                    //         },
                                    //         type: {
                                    //             type: 'string',
                                    //             example: 'Point',
                                    //         },
                                    //     },
                                    // },
                                    phoneNumber: {
                                        type: 'string',
                                        example: '01066032874',
                                    },
                                    createdAt: {
                                        type: 'string',
                                        example: '2023-11-24T19:40:36.469Z',
                                    },
                                    updatedAt: {
                                        type: 'string',
                                        example: '2023-11-28T19:32:16.141Z',
                                    },
                                    bio: {
                                        type: 'string',
                                        example: 'i am a carpenter',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        404: {
            description: 'Tasker not found',
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
                            message: {
                                type: 'string',
                                example: "The tasker with id 6560fc346f972e1d74a7125 doesn't exist",
                            },
                            status: {
                                type: 'number',
                                example: 404,
                            },
                            data: null,
                        },
                    },
                },
            },
        },
    },
};
exports.getTaskers = {
    tags: ['Taskers'],
    description: 'Get list of taskers',
    operationId: 'getTaskers',
    parameters: [
        {
            in: 'header',
            name: 'accept-language',
            type: 'string',
        },
        {
            name: 'categories',
            in: 'query',
            description: 'Category ID',
            schema: {
                type: 'string',
            },
        },
        {
            // rating
            name: 'rating',
            in: 'query',
            description: 'Example: rating[gt]=3 | rating[gte]=3 | rating[lt]=3 | rating[lte]=3',
            schema: {
                type: 'number',
            },
        },
        {
            name: 'location',
            in: 'query',
            description: "User's location in the format `longitude,latitude` respectively ",
        },
        {
            name: 'maxDistance',
            in: 'query',
            description: 'Maximum distance in kilometers, default is `60 km`',
            schema: {
                type: 'number',
            },
        },
        {
            name: 'fields',
            in: 'query',
            description: 'Fields to return',
            schema: {
                type: 'string',
            },
        },
        {
            name: 'sort',
            in: 'query',
            description: 'Sort by fields',
            schema: {
                type: 'string',
            },
        },
        {
            name: 'limit',
            in: 'query',
            schema: {
                type: 'number',
            },
        },
        {
            name: 'page',
            in: 'query',
            schema: {
                type: 'number',
            },
        },
        {
            name: 'keyword',
            in: 'query',
            description: 'Search by keyword',
            schema: {
                type: 'string',
            },
        },
    ],
    responses: {
        200: {
            description: 'Taskers',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            results: {
                                type: 'number',
                                example: 9,
                            },
                            pagination: {
                                type: 'object',
                                properties: {
                                    currentPage: {
                                        type: 'number',
                                        example: 1,
                                    },
                                    limit: {
                                        type: 'number',
                                        example: 2,
                                    },
                                    skip: {
                                        type: 'number',
                                        example: 0,
                                    },
                                    totalPages: {
                                        type: 'number',
                                        example: 4,
                                    },
                                    totalDocuments: {
                                        type: 'number',
                                        example: 8,
                                    },
                                    next: {
                                        type: 'number',
                                        example: 2,
                                    },
                                },
                            },
                            success: {
                                type: 'boolean',
                                example: true,
                            },
                            message: {
                                type: 'string',
                                example: 'Taskers list',
                            },
                            status: {
                                type: 'number',
                                example: 200,
                            },
                            data: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        _id: {
                                            type: 'string',
                                            example: '656f8a2ad9acb58aba0707fd',
                                        },
                                        userId: {
                                            type: 'string',
                                            example: '656f8a2ad9acb58aba0707fd',
                                        },
                                        categories: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                example: '656238d82ff5c250c72f093d',
                                            },
                                        },
                                        rating: {
                                            type: 'number',
                                            example: 3,
                                        },
                                        completedTasks: {
                                            type: 'number',
                                            example: 9,
                                        },
                                        location: {
                                            type: 'object',
                                            properties: {
                                                coordinates: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'number',
                                                        example: 31.185277,
                                                    },
                                                },
                                                type: {
                                                    type: 'string',
                                                    example: 'Point',
                                                },
                                            },
                                        },
                                        phoneNumber: {
                                            type: 'string',
                                            example: '01066032809',
                                        },
                                        createdAt: {
                                            type: 'string',
                                            example: '2023-12-05T20:38:02.748Z',
                                        },
                                        updatedAt: {
                                            type: 'string',
                                            example: '2023-12-05T20:38:02.748Z',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
exports.becomeTasker = {
    security: [{ bearerAuth: [] }],
    tags: ['Taskers'],
    // summary: 'Become a tasker',
    description: 'Register a new taskers. The user must be logged in.',
    operationId: 'becomeTasker',
    parameters: [
        {
            in: 'header',
            name: 'accept-language',
            type: 'string',
        },
    ],
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        categories: {
                            type: 'array',
                            items: {
                                type: 'string',
                                example: '6560fabd6f972e1d74a71242',
                            },
                        },
                        bio: {
                            type: 'string',
                            example: 'i am a carpenter',
                        },
                        phoneNumber: {
                            type: 'string',
                            example: '01066032874',
                        },
                    },
                },
            },
        },
    },
    // response: {
    //   201: {
    //     description: 'Tasker created',
    //     content: {
    //       'application/json': {
    //         schema: {
    //           type: 'object',
    //           properties: {
    //             success: {
    //               type: 'boolean',
    //               example: true,
    //             },
    //             error: {
    //               type: 'boolean',
    //               example: false,
    //             },
    //             message: {
    //               type: 'string',
    //               example: 'Tasker created',
    //             },
    //             status: {
    //               type: 'number',
    //               example: 201,
    //             },
    //             data: {
    //               type: 'object',
    //               properties: {
    //                 userId: {
    //                   type: 'string',
    //                   example: '6589c1e4b8f40ae741da46e7',
    //                 },
    //                 services: {
    //                   type: 'array',
    //                   items: {
    //                     type: 'string',
    //                     example: '656238d82ff5c250c72f093d',
    //                   },
    //                 },
    //                 rating: {
    //                   type: 'number',
    //                   example: 0,
    //                 },
    //                 completedTasks: {
    //                   type: 'number',
    //                   example: 0,
    //                 },
    //                 location: {
    //                   type: 'object',
    //                   properties: {
    //                     coordinates: {
    //                       type: 'array',
    //                       items: {
    //                         type: 'number',
    //                         example: 31.185277,
    //                       },
    //                     },
    //                     type: {
    //                       type: 'string',
    //                       example: 'Point',
    //                     },
    //                   },
    //                 },
    //                 phoneNumber: {
    //                   type: 'string',
    //                   example: '01066032886',
    //                 },
    //                 _id: {
    //                   type: 'string',
    //                   example: '65aa1c70b6b743a04822eaff',
    //                 },
    //                 createdAt: {
    //                   type: 'string',
    //                   example: '2024-01-19T06:53:36.249Z',
    //                 },
    //                 updatedAt: {
    //                   type: 'string',
    //                   example: '2024-01-19T06:53:36.249Z',
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // 400: {
    //   description: 'Validation Error',
    //   content: {
    //     'application/json': {
    //       schema: {
    //         type: 'object',
    //         properties: {
    //           errors: {
    //             type: 'array',
    //             items: {
    //               type: 'object',
    //               properties: {
    //                 type: {
    //                   type: 'string',
    //                   example: 'field',
    //                 },
    //                 value: {
    //                   type: 'number',
    //                   example: 5,
    //                 },
    //                 msg: {
    //                   type: 'string',
    //                   example: 'Rating is not allowed',
    //                 },
    //                 path: {
    //                   type: 'string',
    //                   example: 'rating',
    //                 },
    //                 location: {
    //                   type: 'string',
    //                   example: 'body',
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
    // },
    responses: {
        200: {
            description: 'Tasker',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: true,
                            },
                            error: {
                                type: 'boolean',
                                example: false,
                            },
                            message: {
                                type: 'string',
                                example: 'Tasker updated',
                            },
                            status: {
                                type: 'number',
                                example: 200,
                            },
                            data: null,
                        },
                    },
                },
            },
        },
        400: {
            description: 'Validation Error',
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
                                            type: 'number',
                                            example: 5,
                                        },
                                        msg: {
                                            type: 'string',
                                            example: 'Rating is not allowed',
                                        },
                                        path: {
                                            type: 'string',
                                            example: 'rating',
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
    },
};
exports.getMyTaskerProfile = {
    security: [{ bearerAuth: [] }],
    tags: ['Taskers'],
    description: 'Get My Tasker Profile',
    operationId: 'getMyTaskerProfile',
    parameters: [
        {
            in: 'header',
            name: 'accept-language',
            type: 'string',
        },
    ],
    responses: {
        200: {
            description: 'Tasker',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: true,
                            },
                            error: {
                                type: 'boolean',
                                example: false,
                            },
                            message: {
                                type: 'string',
                                example: 'Tasker found',
                            },
                            status: {
                                type: 'number',
                                example: 200,
                            },
                            data: {
                                type: 'object',
                                properties: {
                                    _id: {
                                        type: 'string',
                                        example: '6560fc346f972e1d74a7125d',
                                    },
                                    userId: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '6560f8056f972e1d74a71226',
                                            },
                                            firstName: {
                                                type: 'string',
                                                example: 'user',
                                            },
                                            lastName: {
                                                type: 'string',
                                                example: '1',
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
                                    categories: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                _id: {
                                                    type: 'string',
                                                    example: '6560fabd6f972e1d74a71242',
                                                },
                                                name: {
                                                    type: 'string',
                                                    example: 'نجار',
                                                },
                                            },
                                        },
                                    },
                                    rating: {
                                        type: 'number',
                                        example: 0,
                                    },
                                    completedTasks: {
                                        type: 'number',
                                        example: 0,
                                    },
                                    location: {
                                        type: 'object',
                                        properties: {
                                            coordinates: {
                                                type: 'array',
                                                items: {
                                                    type: 'number',
                                                    example: 31.815193,
                                                },
                                            },
                                            type: {
                                                type: 'string',
                                                example: 'Point',
                                            },
                                        },
                                    },
                                    phoneNumber: {
                                        type: 'string',
                                        example: '01066032874',
                                    },
                                    createdAt: {
                                        type: 'string',
                                        example: '2023-11-24T19:40:36.469Z',
                                    },
                                    updatedAt: {
                                        type: 'string',
                                        example: '2023-11-28T19:32:16.141Z',
                                    },
                                    bio: {
                                        type: 'string',
                                        example: 'i am a carpenter',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        404: {
            description: 'Tasker not found',
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
                            message: {
                                type: 'string',
                                example: "You don't have a tasker profile",
                            },
                            status: {
                                type: 'number',
                                example: 404,
                            },
                            data: null,
                        },
                    },
                },
            },
        },
    },
};
exports.updateMyTaskerProfile = {
    security: [{ bearerAuth: [] }],
    tags: ['Taskers'],
    description: 'Update My Tasker Profile',
    operationId: 'updateMyTaskerProfile',
    parameters: [
        {
            in: 'header',
            name: 'accept-language',
            type: 'string',
        },
    ],
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        bio: {
                            type: 'string',
                            example: 'i am a carpenter',
                        },
                        phoneNumber: {
                            type: 'string',
                            example: '01066032874',
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Tasker',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: true,
                            },
                            error: {
                                type: 'boolean',
                                example: false,
                            },
                            message: {
                                type: 'string',
                                example: 'Tasker updated',
                            },
                            status: {
                                type: 'number',
                                example: 200,
                            },
                            data: null,
                        },
                    },
                },
            },
        },
        400: {
            description: 'Validation Error',
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
                                            type: 'number',
                                            example: 5,
                                        },
                                        msg: {
                                            type: 'string',
                                            example: 'Rating is not allowed',
                                        },
                                        path: {
                                            type: 'string',
                                            example: 'rating',
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
    },
};
