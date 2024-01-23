import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createOfferValidator = [
  check('taskId').notEmpty().withMessage('is_required').isMongoId().withMessage('invalid_MongoId'),
  check('message').notEmpty().withMessage('is_required').isString().withMessage('invalid_input').isLength({ max: 8000 }).withMessage('exceeds_max_length'),
  check('subMessages').isEmpty().withMessage('not_allowed'),
  check('images').isEmpty().withMessage('not_allowed'),
  check('createdAt').isEmpty().withMessage('not_allowed'),
  check('updatedAt').isEmpty().withMessage('not_allowed'),

  validatorMiddleware,
];

export const updateOfferValidator = [
  check('taskId').isEmpty().withMessage('not_allowed'),
  check('taskerId').isEmpty().withMessage('not_allowed'),
  check('message').optional().isString().withMessage('invalid_input').isLength({ max: 8000 }).withMessage('exceeds_max_length'),
  check('subMessages').isEmpty().withMessage('not_allowed'), // "subMessages is not allowed to be updated in this route
  check('images').isEmpty().withMessage('not_allowed'),
  check('createdAt').isEmpty().withMessage('not_allowed'),
  check('updatedAt').isEmpty().withMessage('not_allowed'),
  validatorMiddleware,
];
