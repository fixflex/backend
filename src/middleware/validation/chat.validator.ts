import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createChatValidator = [
  check('tasker').isMongoId().withMessage('invalid_MongoId'),

  // ====================>>>>>>>>  empty  <<<<<<<<<<<==================== //
  check('_id').isEmpty().withMessage('not_allowed'),
  check('messages').isEmpty().withMessage('not_allowed'),
  check('user').isEmpty().withMessage('not_allowed'),
  check('createdAt').isEmpty().withMessage('not_allowed'),
  check('updatedAt').isEmpty().withMessage('not_allowed'),
  validatorMiddleware,
];
