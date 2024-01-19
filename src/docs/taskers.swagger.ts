export const getTasker = {
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

export const getTaskers = {
  tags: ['Taskers'],
  summary: 'Get list of taskers',
  description:
    "Get a list of taskers filtered and ordered by location. \n\n**Query Parameters:**\n\n* `services` (*optional*): Filter taskers by service(s). Can pass a single service or comma separated list.\n* `longitude` (*optional*): User's longitude location.\n* `latitude` (*optional*): User's latitude location.\n* `maxDistance` (*optional*, default: `60`): Maximum distance in km to search.\n\nIf location parameters are provided, taskers will be returned sorted by proximity to the given point. \n\n_If no parameters are provided, taskers will be returned randomly without filtering or sorting._",
  operationId: 'getTaskers',
  parameters: [
    {
      name: 'services',
      in: 'query',
      description: 'Service ID',
      required: false,
      schema: {
        type: 'string',
      },
    },
    {
      name: 'latitude',
      in: 'query',
      description: "User's latitude",
      required: false,
      schema: {
        type: 'number',
      },
    },
    {
      name: 'longitude',
      in: 'query',
      description: "User's longitude",
      required: false,
      schema: {
        type: 'number',
      },
    },
    {
      name: 'maxDistance',
      in: 'query',
      description: 'Maximum distance in kilometers',
      required: false,
      schema: {
        type: 'number',
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
                    services: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          _id: {
                            type: 'string',
                            example: '656238d82ff5c250c72f093d',
                          },
                          name: {
                            type: 'string',
                            example: 'سباك',
                          },
                        },
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
                    /*location: {
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
                  },*/
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

export const becomeTasker = {
  security: [{ bearerAuth: [] }],
  tags: ['Taskers'],
  // summary: 'Become a tasker',
  description: 'Register a new taskers. The user must be authenticated.',
  operationId: 'becomeTasker',
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

export const getMyTaskerProfile = {
  security: [{ bearerAuth: [] }],
  tags: ['Taskers'],
  description: 'Get My Tasker Profile',
  operationId: 'getMyTaskerProfile',
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

export const updateMyTaskerProfile = {
  security: [{ bearerAuth: [] }],
  tags: ['Taskers'],
  description: 'Update My Tasker Profile',
  operationId: 'updateMyTaskerProfile',
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
