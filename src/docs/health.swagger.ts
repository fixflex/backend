export const healthz = {
  tags: ['Health'],
  summary: 'Health check endpoint',
  description: 'Check if the server is running',
  operationId: 'healthz',
  parameters: [
    {
      in: 'header',
      name: 'accept-language',
      type: 'string',
      example: 'ar',
      // /**Note*/ that you can pass the accept-language parameter in the header or in the cookie.\n if you don't pass it, it will take the default language which is english.\n if you pass it in the header, the value must be a valid language code like en, ar, fr, etc.\n if you pass it in the cookie, the key must be accept-language and the value must be a valid language code like en, ar .
      required: false,
      description:
        'Note: You can pass the `accept-language` parameter in the header or in the cookie.\n' +
        "If you don't pass it at all, it will take the default language, which is English.\n",
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
