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
