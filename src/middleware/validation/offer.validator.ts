import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createOfferValidator = [
  // ====================>>>>>>>> required <<<<<<<<<<<==================== //
  check('taskId').notEmpty().withMessage('is_required').isMongoId().withMessage('invalid_MongoId'),
  check('price')
    .notEmpty()
    .withMessage('is_required')
    .isNumeric()
    .withMessage('invalid_input')
    .isNumeric()
    .withMessage('invalid_input')
    .custom(value => {
      if (value < 5.0) {
        throw new Error('min_length');
      }
      return true;
    }),
  check('message').notEmpty().withMessage('is_required').isLength({ max: 8000 }).withMessage('exceeds_max_length'),

  // ====================>>>>>>>> empty <<<<<<<<<<<==================== //
  check('subMessages').isEmpty().withMessage('not_allowed'),
  check('status').isEmpty().withMessage('not_allowed'),
  check('createdAt').isEmpty().withMessage('not_allowed'),
  check('updatedAt').isEmpty().withMessage('not_allowed'),

  validatorMiddleware,
];

export const updateOfferValidator = [
  // ====================>>>>>>>>  required <<<<<<<<<<<==================== //
  check('id').notEmpty().withMessage('is_required').isMongoId().withMessage('invalid_MongoId'),

  // ====================>>>>>>>>  optional <<<<<<<<<<<==================== //
  check('price')
    .optional()
    .isNumeric()
    .withMessage('invalid_input')
    .custom(value => {
      if (value < 5.0) {
        throw new Error('min_length');
      }
      return true;
    }),

  check('message').optional().isLength({ max: 8000 }).withMessage('exceeds_max_length'),

  // ====================>>>>>>>>  empty <<<<<<<<<<<==================== //
  check('taskId').isEmpty().withMessage('not_allowed'),
  check('taskerId').isEmpty().withMessage('not_allowed'),
  check('status').isEmpty().withMessage('not_allowed'),
  check('subMessages').isEmpty().withMessage('not_allowed'),
  check('createdAt').isEmpty().withMessage('not_allowed'),
  check('updatedAt').isEmpty().withMessage('not_allowed'),
  validatorMiddleware,
];
