export const signup = {
  tags: ['Auth'],
  description: 'This route allow you to sign up into the api',
  opeationId: 'signup',
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
            firstName: {
              type: 'string',
              required: true,
            },
            lastName: {
              type: 'string',
              required: true,
            },
            email: {
              type: 'string',
              required: true,
            },
            password: {
              type: 'string',
              required: true,
            },
            phone: {
              type: 'string',
            },
            address: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User data',
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
                type: 'number',
                example: 201,
              },
              message: {
                type: 'string',
                example: 'User created successfully.',
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

                  profileImage: {
                    type: 'string',
                    example1: null,
                    example:
                      'https://res.cloudinary.com/dknma8cck/image/upload/v1629291909/EcommerceAPI/Users/admin/xxcrbfkwglqa5c5kay4u.webp',
                  },
                },
              },
            },
          },
        },
      },
      headers: {
        'Set-Cookie': {
          // description: 'access and refresh tokens',
          schema: {
            type: 'string',
            example: [
              'access_token=<access_token_value>; Path=/; Secure; HttpOnly; Expires=Fri, 12 Jul 2024 05:32:29 GMT',
              'refresh_token=<refresh_token_value>; Path=/api/v1/auth/refresh-token; Secure; HttpOnly; Expires=Fri, 12 Jul 2024 05:32:29 GMT',
            ],
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
                      example: 'User password is required',
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
              message: {
                type: 'string',
                example: 'Email already exists {email}.',
              },
              error: {
                type: 'boolean',
                example: true,
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

export const login = {
  tags: ['Auth'],
  description: 'This route allow you to login into the api',
  opeationId: 'login',
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
            email: {
              type: 'string',
              required: true,
            },
            password: {
              type: 'string',
              required: true,
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User data',
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
                example: 'User logged in successfully.',
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

                  profileImage: {
                    type: 'string',
                    example1: null,
                    example:
                      'https://res.cloudinary.com/dknma8cck/image/upload/v1629291909/EcommerceAPI/Users/admin/xxcrbfkwglqa5c5kay4u.webp',
                  },
                },
              },
            },
          },
        },
      },

      headers: {
        'Set-Cookie': {
          // description: 'access and refresh tokens',
          schema: {
            type: 'string',
            example: [
              'access_token=<access_token_value>; Path=/; Secure; HttpOnly; Expires=Fri, 12 Jul 2024 05:32:29 GMT',
              'refresh_token=<refresh_token_value>; Path=/api/v1/auth/refresh-token; Secure; HttpOnly; Expires=Fri, 12 Jul 2024 05:32:29 GMT',
            ],
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
                      example: 'User password is required',
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
              message: {
                type: 'string',
                example: 'Incorrect email or password.',
              },
              error: {
                type: 'boolean',
                example: true,
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

export const logout = {
  security: [{ bearerAuth: [] }],
  tags: ['Auth'],
  description: 'Logout route to invalidate access and refresh tokens',
  operationId: 'logout',
  parameters: [
    {
      in: 'header',
      name: 'accept-language',
      type: 'string',
    },
  ],
  responses: {
    200: {
      description: 'Logout successful',
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
                example: 'Logout successful. Access and refresh tokens invalidated.',
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
      description: 'Unauthorized - Invalid or expired token',
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
                type: 'number',
                example: 401,
              },
              message: {
                type: 'string',
                example: 'Unauthorized. Invalid or expired token.',
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

export const googleSignIn = {
  tags: ['Auth'],
  description: 'This route allow you to login into the api using google auth',
  opeationId: 'googleSignIn',
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
            credential: {
              type: 'string',
              required: true,
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User data',
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
                example: 'User logged in successfully.',
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
                  // continue
                },
              },
            },
          },
        },
      },

      headers: {
        'Set-Cookie': {
          // description: 'access and refresh tokens',
          schema: {
            type: 'string',
            example: [
              'access_token=<access_token_value>; Path=/; Secure; HttpOnly; Expires=Fri, 12 Jul 2024 05:32:29 GMT',
              'refresh_token=<refresh_token_value>; Path=/api/v1/auth/refresh-token; Secure; HttpOnly; Expires=Fri, 12 Jul 2024 05:32:29 GMT',
            ],
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
              message: {
                type: 'string',
                example: 'Bad Request.',
              },
              error: {
                type: 'boolean',
                example: true,
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

export const refreshToken = {
  security: {
    bearerAuth: [], // Assuming you have a separate security definition for refresh tokens
  },
  tags: ['Auth'],
  description: 'Refresh access token using a valid refresh token',
  operationId: 'refreshToken',
  parameters: [
    {
      in: 'header',
      name: 'accept-language',
      type: 'string',
    },
  ],
  responses: {
    200: {
      description: 'Access token refreshed successfully',
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
                example: 'Access token refreshed successfully.',
              },
              data: {
                type: 'object',
                example: null,
              },
            },
          },
        },
      },
      headers: {
        'Set-Cookie': {
          // description: 'access and refresh tokens',
          schema: {
            type: 'string',
            example: 'access_token=<access_token_value>; Path=/; Secure; HttpOnly; Expires=Fri, 12 Jul 2024 05:32:29 GMT',
          },
        },
      },
    },
    401: {
      description: 'Unauthorized - Invalid or expired refresh token',
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
              message: {
                type: 'string',
                example: 'Unauthorized. Invalid or expired refresh token.',
              },
            },
          },
        },
      },
    },
    // Add more response codes as needed...
  },
};

export const forgotPassword = {
  tags: ['Auth'],
  description: 'This route allow you to send reset password link to your email',
  opeationId: 'forgotPassword',
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
            email: {
              type: 'string',
              required: true,
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User data',
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
                example: 'Password reset done sent to email!, please check your email inbox',
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
              error: {
                type: 'boolean',
                example: true,
              },
              status: {
                type: 'number',
                example: 404,
              },
              message: {
                type: 'string',
                example: 'Email not found.',
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

export const verifyResetCode = {
  tags: ['Auth'],
  description: 'This route allow you to verify reset code sent to your email',
  opeationId: 'verifyResetCode',
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
            email: {
              type: 'string',
              required: true,
              example: 'user@gmail.com',
            },
            resetCode: {
              type: 'string',
              required: true,
              example: '123456',
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User data',
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
                example: 'Password reset code verified',
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
              error: {
                type: 'boolean',
                example: true,
              },
              status: {
                type: 'number',
                example: 404,
              },
              message: {
                type: 'string',
                example: 'Email not found.',
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
              error: {
                type: 'boolean',
                example: true,
              },
              status: {
                type: 'number',
                example: 400,
              },
              message: {
                type: 'string',
                example: 'Invalid reset code or expired.',
              },
            },
          },
        },
      },
    },
  },
};

export const resetPassword = {
  tags: ['Auth'],
  description: 'This route allow you to reset password',
  opeationId: 'resetPassword',
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
            email: {
              type: 'string',
              required: true,
              example: 'user@gmail.com',
            },
            // resetCode: {
            //   type: 'string',
            //   required: true,
            //   example: '123456',
            // },
            newPassword: {
              type: 'string',
              required: true,
              example: '123456',
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User data',
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
                example: 'User logged in successfully.',
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

                  profileImage: {
                    type: 'string',
                    example1: null,
                    example:
                      'https://res.cloudinary.com/dknma8cck/image/upload/v1629291909/EcommerceAPI/Users/admin/xxcrbfkwglqa5c5kay4u.webp',
                  },
                },
              },
            },
          },
        },
      },

      headers: {
        'Set-Cookie': {
          // description: 'access and refresh tokens',
          schema: {
            type: 'string',
            example: [
              'access_token=<access_token_value>; Path=/; Secure; HttpOnly; Expires=Fri, 12 Jul 2024 05:32:29 GMT',
              'refresh_token=<refresh_token_value>; Path=/api/v1/auth/refresh-token; Secure; HttpOnly; Expires=Fri, 12 Jul 2024 05:32:29 GMT',
            ],
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

              error: {
                type: 'boolean',
                example: true,
              },

              status: {
                type: 'number',
                example: 404,
              },

              message: {
                type: 'string',
                example: 'Email not found.',
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

              error: {
                type: 'boolean',
                example: true,
              },

              status: {
                type: 'number',
                example: 400,
              },

              message: {
                type: 'string',
                example: 'Invalid reset code or expired.',
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

export const changePassword = {
  security: [{ bearerAuth: [] }],
  tags: ['Auth'],
  description: 'This route allow you to change password',
  operationId: 'changePassword',
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
            oldPassword: {
              type: 'string',
              required: true,
              example: 'oldPassword',
            },
            newPassword: {
              type: 'string',
              required: true,
              example: 'newPassword',
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User data',
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
                example: 'Password changed successfully.',
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
