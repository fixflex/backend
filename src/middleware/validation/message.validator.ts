import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createMessageValidator = [
  // ====================>>>>>>>>  required  <<<<<<<<<<<==================== //
  check('message').isString().withMessage('must be a string'),
  check('chatId').isMongoId().withMessage('must be a valid mongo id'),

  // ====================>>>>>>>>  empty <<<<<<<<<<<==================== //
  check('_id').isEmpty().withMessage('not_allowed'),
  check('sender').isEmpty().withMessage('not_allowed'),
  check('createdAt').isEmpty().withMessage('not_allowed'),
  check('updatedAt').isEmpty().withMessage('not_allowed'),
  validatorMiddleware,
];
