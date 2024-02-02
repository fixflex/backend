"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.uploadTaskImages = exports.createTask = exports.getTask = exports.getTasks = void 0;
exports.getTasks = {
    tags: ['Tasks'],
    description: 'Get list of tasks',
    operationId: 'getTasks',
    parameters: [
        {
            in: 'query',
            name: 'category_id',
            type: 'string',
        },
        {
            in: 'query',
            name: 'location',
            type: 'string',
            description: 'longitude, latitude  (30.745831, 28.101130)',
        },
        {
            in: 'query',
            name: 'maxDistance',
            type: 'number',
            description: 'in km, default is `60km`',
        },
        {
            in: 'query',
            name: 'budget',
            type: 'number',
            description: 'Example `budget[gte]=100&budget[lte]=200` to get tasks with budget between 100 and 200',
        },
        {
            in: 'query',
            name: 'sort',
            type: 'string',
            description: 'Example: `-createdAt` will sort by descending order or `createdAt` will sort by ascending order',
        },
        {
            in: 'query',
            name: 'page',
            type: 'number',
        },
        {
            in: 'query',
            name: 'limit',
            type: 'number',
            description: 'default is `20`',
        },
        {
            in: 'query',
            name: 'fields',
            type: 'string',
            description: 'Select which fields to include in the response, Example: `title,category` to include or `-title,-category` to exclude',
        },
        {
            in: 'query',
            name: 'keyword',
            type: 'string',
            description: 'Search in title and details fields',
        },
        {
            in: 'header',
            name: 'accept-language',
            type: 'string',
        },
    ],
    responses: {
        200: {
            descriptoin: 'Get list of tasks',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            results: {
                                type: 'number',
                                example: 20,
                            },
                            pagination: {
                                type: 'object',
                                properties: {
                                    totalDocuments: {
                                        type: 'number',
                                        example: 1,
                                    },
                                    limit: {
                                        type: 'number',
                                        example: 10,
                                    },
                                    totalPages: {
                                        type: 'number',
                                        example: 99,
                                    },
                                    currentPage: {
                                        type: 'number',
                                        example: 1,
                                    },
                                    prev: {
                                        type: 'number',
                                        example: null,
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
                                example: 'Tasks retrieved successfully',
                            },
                            data: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        _id: {
                                            type: 'string',
                                            example: '65b236563ea5079d86670037',
                                        },
                                        title: {
                                            type: 'string',
                                            example: 'cleaning',
                                        },
                                        category: {
                                            type: 'string',
                                            example: '65aee72b4adc6b5e31e94044',
                                        },
                                        location: {
                                            type: 'object',
                                            properties: {
                                                coordinates: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'number',
                                                    },
                                                    example: [34.781767, 32.0853],
                                                },
                                                online: {
                                                    type: 'boolean',
                                                    example: false,
                                                },
                                            },
                                        },
                                        dueDate: {
                                            type: 'object',
                                            properties: {
                                                on: {
                                                    type: 'string',
                                                    format: 'date',
                                                    example: '2021-12-30',
                                                },
                                            },
                                        },
                                        time: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                enum: ['MONRING', 'MIDDAY', 'AFTERNOON', 'EVENING'],
                                            },
                                            example: ['MIDDAY', 'MORNING'],
                                        },
                                        budget: {
                                            type: 'number',
                                            example: 120,
                                        },
                                        createdAt: {
                                            type: 'string',
                                            format: 'date-time',
                                            example: '2021-08-19T19:36:38.000Z',
                                        },
                                        updatedAt: {
                                            type: 'string',
                                            format: 'date-time',
                                            example: '2021-08-19T19:36:38.000Z',
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
exports.getTask = {
    tags: ['Tasks'],
    description: 'Get task by id',
    operationId: 'getTask',
    parameters: [
        {
            in: 'path',
            name: 'taskId',
            type: 'string',
        },
        {
            in: 'header',
            name: 'accept-language',
            type: 'string',
        },
    ],
    responses: {
        200: {
            description: 'Get task by id',
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
                                example: 'Task found successfully',
                            },
                            data: {
                                type: 'object',
                                properties: {
                                    _id: {
                                        type: 'string',
                                        example: '65b236563ea5079d86670037',
                                    },
                                    title: {
                                        type: 'string',
                                        example: 'cleaning',
                                    },
                                    category: {
                                        type: 'string',
                                        example: '65aee72b4adc6b5e31e94044',
                                    },
                                    details: {
                                        type: 'string',
                                        example: 'Dusting, mopping and vacuuming',
                                    },
                                    location: {
                                        type: 'object',
                                        properties: {
                                            coordinates: {
                                                type: 'array',
                                                items: {
                                                    type: 'number',
                                                },
                                                example: [34.781767, 32.0853],
                                            },
                                            online: {
                                                type: 'boolean',
                                                example: false,
                                            },
                                        },
                                    },
                                    dueDate: {
                                        type: 'object',
                                        properties: {
                                            on: {
                                                type: 'string',
                                                format: 'date',
                                                example: '2021-12-30',
                                            },
                                        },
                                    },
                                    time: {
                                        type: 'array',
                                        items: {
                                            type: 'string',
                                            enum: ['MONRING', 'MIDDAY', 'AFTERNOON', 'EVENING'],
                                        },
                                        example: ['MIDDAY', 'MORNING'],
                                    },
                                    budget: {
                                        type: 'number',
                                        example: 120,
                                    },
                                    offers: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                _id: {
                                                    type: 'string',
                                                    example: '65bcfaa5c6b84484680fc2dc',
                                                },
                                                taskerId: {
                                                    type: 'string',
                                                    example: '65b64c83ac819f33de11df9d',
                                                },
                                                taskId: {
                                                    type: 'string',
                                                    example: '65bcfa5ec6b84484680fc2d1',
                                                },
                                                price: {
                                                    type: 'number',
                                                    example: 120,
                                                },
                                                status: {
                                                    type: 'string',
                                                    enum: ['PENDING', 'ACCEPTED', 'CANCELLED'],
                                                    example: 'ACCEPTED',
                                                },
                                                message: {
                                                    type: 'string',
                                                    example: 'Offer for task 2 , by user 1',
                                                },
                                                subMessages: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            userId: {
                                                                type: 'string',
                                                                example: '65b64c83ac819f33de11df9d',
                                                            },
                                                            message: {
                                                                type: 'string',
                                                                example: 'I will do it for 100',
                                                            },
                                                        },
                                                    },
                                                },
                                                createdAt: {
                                                    type: 'string',
                                                    format: 'date-time',
                                                    example: '2024-02-02T14:22:29.803Z',
                                                },
                                                updatedAt: {
                                                    type: 'string',
                                                    format: 'date-time',
                                                    example: '2024-02-02T14:25:27.140Z',
                                                },
                                            },
                                        },
                                    },
                                    paymentMethod: {
                                        type: 'string',
                                        enum: ['CASH', 'CARD'],
                                        example: 'CASH',
                                    },
                                    acceptedOffer: {
                                        type: 'string',
                                        example: '65bcfaa5c6b84484680fc2dc',
                                    },
                                    imageCover: {
                                        type: 'object',
                                        properties: {
                                            url: {
                                                type: 'string',
                                                example: 'https://res.cloudinary.com/deak07uus/image/upload/v1706266848/task-images/cei1jswmt6glsnsmurbf.png',
                                            },
                                            publicId: {
                                                type: 'string',
                                                example: 'task-images/cei1jswmt6glsnsmurbf',
                                            },
                                        },
                                    },
                                    images: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                url: {
                                                    type: 'string',
                                                    example: 'https://res.cloudinary.com/deak07uus/image/upload/v1706266850/task-images/w2qrpabd4vuksidjkylu.jpg',
                                                },
                                                publicId: {
                                                    type: 'string',
                                                    example: 'task-images/w2qrpabd4vuksidjkylu',
                                                },
                                            },
                                        },
                                    },
                                    createdAt: {
                                        type: 'string',
                                        format: 'date-time',
                                        example: '2021-08-19T19:36:38.000Z',
                                    },
                                    updatedAt: {
                                        type: 'string',
                                        format: 'date-time',
                                        example: '2021-08-19T19:36:38.000Z',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        404: {
            description: 'Error: 404',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: false,
                            },
                            message: {
                                type: 'string',
                                example: 'Task not found',
                            },
                            data: {
                                type: 'string',
                                example: null,
                            },
                        },
                    },
                },
            },
        },
    },
};
exports.createTask = {
    tags: ['Tasks'],
    description: 'Create new task',
    operationId: 'createTask',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: 'header',
            name: 'accept-language',
            type: 'string',
        },
    ],
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            example: 'cleaning',
                        },
                        category: {
                            type: 'string',
                            example: '65aee72b4adc6b5e31e94044',
                        },
                        details: {
                            type: 'string',
                            example: 'Dusting, mopping and vacuuming',
                        },
                        location: {
                            type: 'object',
                            properties: {
                                coordinates: {
                                    type: 'array',
                                    items: {
                                        type: 'number',
                                    },
                                    example: [34.781767, 32.0853],
                                },
                                online: {
                                    type: 'boolean',
                                    example: false,
                                },
                            },
                        },
                        dueDate: {
                            type: 'object',
                            properties: {
                                on: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2021-12-30',
                                },
                                before: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-12-30',
                                },
                                flexible: {
                                    type: 'boolean',
                                    example: false,
                                },
                            },
                        },
                        time: {
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: ['MONRING', 'MIDDAY', 'AFTERNOON', 'EVENING'],
                            },
                            example: ['MIDDAY', 'MORNING'],
                        },
                        budget: {
                            type: 'number',
                            example: 120,
                        },
                    },
                    required: ['title', 'details', 'location', 'budget'],
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Create new task',
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
                                example: 'Task created successfully',
                            },
                            data: {
                                type: 'object',
                                properties: {
                                    _id: {
                                        type: 'string',
                                        example: '611d08a62fc210a30ecfb75b',
                                    },
                                    title: {
                                        type: 'string',
                                        example: 'cleaning',
                                    },
                                    category: {
                                        type: 'string',
                                        example: '65aee72b4adc6b5e31e94044',
                                    },
                                    details: {
                                        type: 'string',
                                        example: 'Dusting, mopping and vacuuming',
                                    },
                                    location: {
                                        type: 'object',
                                        properties: {
                                            coordinates: {
                                                type: 'array',
                                                items: {
                                                    type: 'number',
                                                },
                                                example: [34.781767, 32.0853],
                                            },
                                            online: {
                                                type: 'boolean',
                                                example: false,
                                            },
                                        },
                                    },
                                    dueDate: {
                                        type: 'object',
                                        properties: {
                                            on: {
                                                type: 'string',
                                                format: 'date',
                                                example: '2021-12-30',
                                            },
                                        },
                                    },
                                    time: {
                                        type: 'array',
                                        items: {
                                            type: 'string',
                                            enum: ['MONRING', 'MIDDAY', 'AFTERNOON', 'EVENING'],
                                        },
                                        example: ['MIDDAY', 'MORNING'],
                                    },
                                    budget: {
                                        type: 'number',
                                        example: 120,
                                    },
                                    status: {
                                        type: 'string',
                                        enum: ['OPEN', 'ASSIGNED', 'COMPLETED', 'CANCELLED'],
                                        example: 'OPEN',
                                    },
                                    createdAt: {
                                        type: 'string',
                                        format: 'date-time',
                                        example: '2021-08-19T19:36:38.000Z',
                                    },
                                    updatedAt: {
                                        type: 'string',
                                        format: 'date-time',
                                        example: '2021-08-19T19:36:38.000Z',
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
                                        msg: {
                                            type: 'string',
                                            example: 'Title must be between 5 and 200 characters',
                                        },
                                        path: {
                                            type: 'string',
                                            example: 'title',
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
                            message: {
                                type: 'string',
                                example: 'Unauthorized',
                            },
                            data: {
                                type: 'string',
                                example: null,
                            },
                        },
                    },
                },
            },
        },
    },
};
exports.uploadTaskImages = {
    tags: ['Tasks'],
    description: 'Upload task images',
    operationId: 'uploadTaskImages',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: 'path',
            name: 'taskId',
            type: 'string',
            example: '65b236563ea5079d86670037',
        },
        {
            in: 'header',
            name: 'accept-language',
            type: 'string',
        },
    ],
    requestBody: {
        required: true,
        content: {
            'multipart/form-data': {
                schema: {
                    type: 'object',
                    properties: {
                        imageCover: {
                            type: 'string',
                            format: 'binary',
                        },
                        image: {
                            type: 'array',
                            description: 'The `maximum` number of files allowed is `5`',
                            items: {
                                type: 'string',
                                format: 'binary',
                            },
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Upload task images',
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
                                example: 'Images uploaded successfully',
                            },
                            data: {
                                type: 'object',
                                properties: {
                                    _id: {
                                        type: 'string',
                                        example: '65b236563ea5079d86670037',
                                    },
                                    title: {
                                        type: 'string',
                                        example: 'cleaning',
                                    },
                                    category: {
                                        type: 'string',
                                        example: '65aee72b4adc6b5e31e94044',
                                    },
                                    details: {
                                        type: 'string',
                                        example: 'Dusting, mopping and vacuuming',
                                    },
                                    location: {
                                        type: 'object',
                                        properties: {
                                            coordinates: {
                                                type: 'array',
                                                items: {
                                                    type: 'number',
                                                },
                                                example: [34.781767, 32.0853],
                                            },
                                            online: {
                                                type: 'boolean',
                                                example: false,
                                            },
                                        },
                                    },
                                    dueDate: {
                                        type: 'object',
                                        properties: {
                                            on: {
                                                type: 'string',
                                                format: 'date',
                                                example: '2021-12-30',
                                            },
                                        },
                                    },
                                    time: {
                                        type: 'array',
                                        items: {
                                            type: 'string',
                                            enum: ['MONRING', 'MIDDAY', 'AFTERNOON', 'EVENING'],
                                        },
                                        example: ['MIDDAY', 'MORNING'],
                                    },
                                    budget: {
                                        type: 'number',
                                        example: 120,
                                    },
                                    imageCover: {
                                        type: 'object',
                                        properties: {
                                            url: {
                                                type: 'string',
                                                example: 'https://res.cloudinary.com/deak07uus/image/upload/v1706266848/task-images/cei1jswmt6glsnsmurbf.png',
                                            },
                                            publicId: {
                                                type: 'string',
                                                example: 'task-images/cei1jswmt6glsnsmurbf',
                                            },
                                        },
                                    },
                                    images: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                url: {
                                                    type: 'string',
                                                    example: 'https://res.cloudinary.com/deak07uus/image/upload/v1706266850/task-images/w2qrpabd4vuksidjkylu.jpg',
                                                },
                                                publicId: {
                                                    type: 'string',
                                                    example: 'task-images/w2qrpabd4vuksidjkylu',
                                                },
                                            },
                                        },
                                    },
                                    createdAt: {
                                        type: 'string',
                                        format: 'date-time',
                                        example: '2021-08-19T19:36:38.000Z',
                                    },
                                    updatedAt: {
                                        type: 'string',
                                        format: 'date-time',
                                        example: '2021-08-19T19:36:38.000Z',
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
exports.updateTask = {
    tags: ['Tasks'],
    description: 'Update task by id',
    operationId: 'updateTask',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: 'path',
            name: 'taskId',
            type: 'string',
            example: '65b236563ea5079d86670037',
        },
        {
            in: 'header',
            name: 'accept-language',
            type: 'string',
        },
    ],
    requestBody: {
        required: false,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            example: 'cleaning',
                        },
                        category: {
                            type: 'string',
                            example: '65aee72b4adc6b5e31e94044',
                        },
                        details: {
                            type: 'string',
                            example: 'Dusting, mopping and vacuuming',
                        },
                        location: {
                            type: 'object',
                            properties: {
                                coordinates: {
                                    type: 'array',
                                    items: {
                                        type: 'number',
                                    },
                                    example: [34.781767, 32.0853],
                                },
                                online: {
                                    type: 'boolean',
                                    example: false,
                                },
                            },
                        },
                        dueDate: {
                            type: 'object',
                            properties: {
                                on: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2021-12-30',
                                },
                                before: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-12-30',
                                },
                                flexible: {
                                    type: 'boolean',
                                    example: false,
                                },
                            },
                        },
                        time: {
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: ['MONRING', 'MIDDAY', 'AFTERNOON', 'EVENING'],
                            },
                            example: ['MIDDAY', 'MORNING'],
                        },
                        budget: {
                            type: 'number',
                            example: 120,
                        },
                        status: {
                            type: 'string',
                            enum: ['OPEN', 'ASSIGNED', 'COMPLETED', 'CANCELLED'],
                            example: 'ASSIGNED',
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Update task by id',
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
                                example: 'Task updated successfully',
                            },
                            data: {
                                type: 'object',
                                properties: {
                                    _id: {
                                        type: 'string',
                                        example: '65b236563ea5079d86670037',
                                    },
                                    title: {
                                        type: 'string',
                                        example: 'cleaning',
                                    },
                                    category: {
                                        type: 'string',
                                        example: '65aee72b4adc6b5e31e94044',
                                    },
                                    details: {
                                        type: 'string',
                                        example: 'Dusting, mopping and vacuuming',
                                    },
                                    location: {
                                        type: 'object',
                                        properties: {
                                            coordinates: {
                                                type: 'array',
                                                items: {
                                                    type: 'number',
                                                },
                                                example: [34.781767, 32.0853],
                                            },
                                            online: {
                                                type: 'boolean',
                                                example: false,
                                            },
                                        },
                                    },
                                    dueDate: {
                                        type: 'object',
                                        properties: {
                                            on: {
                                                type: 'string',
                                                format: 'date',
                                                example: '2021-12-30',
                                            },
                                        },
                                    },
                                    time: {
                                        type: 'array',
                                        items: {
                                            type: 'string',
                                            enum: ['MONRING', 'MIDDAY', 'AFTERNOON', 'EVENING'],
                                        },
                                        example: ['MIDDAY', 'MORNING'],
                                    },
                                    budget: {
                                        type: 'number',
                                        example: 120,
                                    },
                                    imageCover: {
                                        type: 'object',
                                        properties: {
                                            url: {
                                                type: 'string',
                                                example: 'https://res.cloudinary.com/deak07uus/image/upload/v1706266848/task-images/cei1jswmt6glsnsmurbf.png',
                                            },
                                            publicId: {
                                                type: 'string',
                                                example: 'task-images/cei1jswmt6glsnsmurbf',
                                            },
                                        },
                                    },
                                    images: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                url: {
                                                    type: 'string',
                                                    example: 'https://res.cloudinary.com/deak07uus/image/upload/v1706266850/task-images/w2qrpabd4vuksidjkylu.jpg',
                                                },
                                                publicId: {
                                                    type: 'string',
                                                    example: 'task-images/w2qrpabd4vuksidjkylu',
                                                },
                                            },
                                        },
                                    },
                                    createdAt: {
                                        type: 'string',
                                        format: 'date-time',
                                        example: '2021-08-19T19:36:38.000Z',
                                    },
                                    updatedAt: {
                                        type: 'string',
                                        format: 'date-time',
                                        example: '2021-08-19T19:36:38.000Z',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        404: {
            description: 'Error: 404',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: false,
                            },
                            message: {
                                type: 'string',
                                example: 'Task not found',
                            },
                            data: {
                                type: 'string',
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
                            errors: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        type: {
                                            type: 'string',
                                            example: 'field',
                                        },
                                        msg: {
                                            type: 'string',
                                            example: 'Title must be between 5 and 200 characters',
                                        },
                                        path: {
                                            type: 'string',
                                            example: 'title',
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
                            message: {
                                type: 'string',
                                example: 'Unauthorized',
                            },
                            data: {
                                type: 'string',
                                example: null,
                            },
                        },
                    },
                },
            },
        },
    },
};
exports.deleteTask = {
    tags: ['Tasks'],
    description: 'Delete task by id',
    operationId: 'deleteTask',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: 'path',
            name: 'taskId',
            type: 'string',
            example: '65b236563ea5079d86670037',
        },
        {
            in: 'header',
            name: 'accept-language',
            type: 'string',
        },
    ],
    responses: {
        200: {
            description: 'Delete task by id',
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
                                example: 'Task deleted successfully',
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
        404: {
            description: 'Error: 404',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: false,
                            },
                            message: {
                                type: 'string',
                                example: 'Task not found',
                            },
                            data: {
                                type: 'string',
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
                                example: false,
                            },
                            message: {
                                type: 'string',
                                example: 'Unauthorized',
                            },
                            data: {
                                type: 'string',
                                example: null,
                            },
                        },
                    },
                },
            },
        },
    },
};
