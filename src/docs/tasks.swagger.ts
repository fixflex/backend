export const createTask = {
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
            title: {
              type: 'string',
              example: 'Fix the toilet',
            },
            description: {
              type: 'string',
              example: 'The toilet is broken and needs to be fixed',
            },
            location: {
              type: 'string',
              example: 'El-Obour City, Cairo, Egypt',
            },
            coordinates: {
              type: 'array',
              items: {
                type: 'number',
              },
              minItems: 2,
              maxItems: 2,
              example: [30.1418, 31.6402],
            },
            service: {
              type: 'string',
              example: '5f9d5f6b0f0a7e2a3c9d3b1a',
            },
            date: {
              type: 'string',
              format: 'date-time',
              example: '2020-11-01T18:25:43.511Z',
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['https://example.com/image.png'],
            },
          },
          required: ['title', 'description', 'location', 'coordinates', 'service', 'date'],
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
