"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthz = void 0;
exports.healthz = {
    tags: ['Health'],
    summary: 'Health check endpoint',
    description: 'Check if the server is running',
    operationId: 'healthz',
    parameters: [
        {
            in: 'header',
            name: 'Accept-Language',
            type: 'string',
            example: 'ar_MX',
        },
    ],
    responses: {
        '200': {
            description: 'OK',
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
                            status: {
                                type: 'number',
                                example: 200,
                            },
                            message: {
                                type: 'string',
                                example: 'Welcome to Rest API',
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