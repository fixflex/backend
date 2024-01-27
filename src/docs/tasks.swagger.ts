export const getTasks = {
  tags: ['Tasks'],
  description: 'Get list of tasks',
  operationId: 'getTasks',
  parameters: [
    {
      in: 'query',
      name: 'category',
      type: 'string',
      example: '65aee72b4adc6b5e31e94044',
    },
    {
      in: 'query',
      name: 'location',
      type: 'string',
      example: '34.781767,32.0853',
    },
    {
      in: 'query',
      name: 'distance',
      type: 'number',
      example: 1000,
    },
    {
      in: 'query',
      name: 'budget',
      type: 'number',
      example: 100,
    },
    {
      in: 'query',
      name: 'dueDate',
      type: 'string',
      example: '2021-12-30',
    },
    {
      in: 'query',
      name: 'time',
      type: 'string',
      example: 'MIDDAY',
    },
    {
      in: 'query',
      name: 'sort',
      type: 'string',
      example: 'createdAt',
    },
    {
      in: 'query',
      name: 'page',
      type: 'number',
      example: 1,
    },
    {
      in: 'query',
      name: 'page',
      type: 'number',
      example: 1,
    },
    {
      in: 'query',
      name: 'limit',
      type: 'number',
      example: 10,
    },
    {
      in: 'query',
      name: 'select',
      type: 'string',
      example: 'title,category',
    },
    {
      in: 'query',
      name: 'populate',
      type: 'string',
      example: 'category',
    },

    {
      in: 'header',
      name: 'accept-language',
      type: 'string',
      example: 'en',
    },
  ],

  responses: {
    200: {
      description: 'Get all tasks',
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
                example: 'Tasks found successfully',
              },

              data: {
                type: 'object',
                properties: {
                  tasks: {
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
                                example: 'https://res.cloudinary.com/deak07uus/image/upload',
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
                  pagination: {
                    type: 'object',
                    properties: {
                      totalDocs: {
                        type: 'number',
                        example: 1,
                      },
                      limit: {
                        type: 'number',
                        example: 10,
                      },
                      totalPages: {
                        type: 'number',
                        example: 1,
                      },
                      page: {
                        type: 'number',
                        example: 1,
                      },
                      pagingCounter: {
                        type: 'number',
                        example: 1,
                      },
                      hasPrevPage: {
                        type: 'boolean',
                        example: false,
                      },
                      hasNextPage: {
                        type: 'boolean',
                        example: false,
                      },
                      prevPage: {
                        type: 'number',
                        example: null,
                      },
                      nextPage: {
                        type: 'number',
                        example: null,
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
  },
};

export const getTask = {
  tags: ['Tasks'],
  description: 'Get task by id',
  operationId: 'getTask',
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
      example: 'en',
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
      example: 'en',
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

export const uploadTaskImages = {
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
      example: 'en',
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

export const updateTask = {
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
      example: 'en',
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

export const deleteTask = {
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
      example: 'en',
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
