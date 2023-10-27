import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createChatValidator = [
  check('client').isMongoId().withMessage('client must be a valid id'),
  check('tasker').isMongoId().withMessage('tasker must be a valid id'),

  validatorMiddleware,
];
