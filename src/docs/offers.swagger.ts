export const getOffers = {
  tags: ['Offers'],
  description: 'Get list of offers',
  operationId: 'getOffers',
  parameters: [
    // {{URL}} /api/v1/offers?taskId=65b913a07846f0b770d184eb&status=PENDING&price[gt]=150

    {
      in: 'query',
      name: 'taskId',
      schema: {
        type: 'string',
      },
      description: 'Task ID',
    },
    {
      in: 'query',
      name: 'status',
      schema: {
        type: 'string',
      },
      description: 'Offer Status',
    },
    {
      in: 'query',
      name: 'price[gt]',
      schema: {
        type: 'number',
      },
      description: 'Price greater than',
    },
    {
      in: 'query',
      name: 'price[gte]',
      schema: {
        type: 'number',
      },
      description: 'Price greater than or equal to',
    },
    {
      in: 'query',
      name: 'price[lt]',
      schema: {
        type: 'number',
      },
      description: 'Price less than',
    },
    {
      in: 'query',
      name: 'price[lte]',
      schema: {
        type: 'number',
      },
      description: 'Price less than or equal to',
    },
    {
      in: 'query',
      name: 'limit',
      schema: {
        type: 'number',
      },
      description: 'Limit',
    },
    {
      in: 'query',
      name: 'page',
      schema: {
        type: 'number',
      },
      description: 'Page',
    },
    {
      in: 'query',
      name: 'sort',
      schema: {
        type: 'string',
      },
      description: 'Sort',
    },
  ],

  responses: {
    200: {
      descriptoin: 'Get list of offers',
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
                      example: '65b913a07846f0b770d184eb',
                    },
                    taskerId: {
                      type: 'string',
                      example: '65b913a07846f0b770d184eb',
                    },
                    taskId: {
                      type: 'string',
                      example: '65b913a07846f0b770d184eb',
                    },
                    message: {
                      type: 'string',
                      example: 'I can do it',
                    },
                    price: {
                      type: 'number',
                      example: 200,
                    },
                    status: {
                      type: 'string',
                      example: 'PENDING',
                    },
                    subMessages: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          userId: {
                            type: 'string',
                            example: '65b913a07846f0b770d184eb',
                          },
                          message: {
                            type: 'string',
                            example: 'I can do it',
                          },
                        },
                      },
                    },
                    createdAt: {
                      type: 'string',
                      example: '2021-07-31T10:00:00.000Z',
                    },
                    updatedAt: {
                      type: 'string',
                      example: '2021-07-31T10:00:00.000Z',
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

export const createOffer = {
  tags: ['Offers'],
  description: 'Create new offer',
  operationId: 'createOffer',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            taskId: {
              type: 'string',
              example: '65b913a07846f0b770d184eb',
            },
            message: {
              type: 'string',
              example: 'I can do it',
            },
            price: {
              type: 'number',
              example: 200,
            },
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Create new offer',
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
                example: 'Offer created successfully',
              },
              data: {
                type: 'object',
                properties: {
                  taskerId: {
                    type: 'string',
                    example: '65b913a07846f0b770d184eb',
                  },
                  taskId: {
                    type: 'string',
                    example: '65b913a07846f0b770d184eb',
                  },
                  message: {
                    type: 'string',
                    example: 'I can do it',
                  },
                  price: {
                    type: 'number',
                    example: 200,
                  },
                  status: {
                    type: 'string',
                    example: 'PENDING',
                  },
                  subMessages: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        userId: {
                          type: 'string',
                          example: '65b913a07846f0b770d184eb',
                        },
                        message: {
                          type: 'string',
                          example: 'I can do it',
                        },
                      },
                    },
                  },
                  createdAt: {
                    type: 'string',
                    example: '2021-07-31T10:00:00.000Z',
                  },
                  updatedAt: {
                    type: 'string',
                    example: '2021-07-31T10:00:00.000Z',
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
