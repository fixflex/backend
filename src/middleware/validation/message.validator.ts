import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createMessageValidator = [
  check('user').isMongoId().withMessage('invalid_MongoId'),
  check('tasker').isMongoId().withMessage('invalid_MongoId'),

  // ====================>>>>>>>> is empty <<<<<<<<<<<==================== //
  check('_id').isEmpty().withMessage('not_allowed'),
  check('sender').isEmpty().withMessage('not_allowed'),
  check('chatId').isEmpty().withMessage('not_allowed'),
  check('createdAt').isEmpty().withMessage('not_allowed'),
  check('updatedAt').isEmpty().withMessage('not_allowed'),
  validatorMiddleware,
];
