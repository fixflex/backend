import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createChatValidator = [
  check('user').isMongoId().withMessage('invalid_MongoId'),
  check('tasker').isMongoId().withMessage('invalid_MongoId'),

  // ====================>>>>>>>> is empty <<<<<<<<<<<==================== //
  check('_id').isEmpty().withMessage('not_allowed'),
  check('messages').isEmpty().withMessage('not_allowed'),
  validatorMiddleware,
];
