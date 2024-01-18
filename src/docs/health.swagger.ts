export const healthz = {
  tags: ['Health'],
  summary: 'Health check endpoint',
  description: 'Check if the server is running',
  operationId: 'healthz',
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
