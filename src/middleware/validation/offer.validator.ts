import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createOfferValidator = [
  check('taskId').notEmpty().withMessage('is_required').isMongoId().withMessage('invalid_MongoId'),
  // check the price is a number and min is 5
  check('price')
    .notEmpty()
    .withMessage('is_required')
    .isNumeric()
    .withMessage('invalid_input')
    .isLength({ min: 5 })
    .withMessage('min_length'),
  check('message')
    .notEmpty()
    .withMessage('is_required')
    .isString()
    .withMessage('invalid_input')
    .isLength({ max: 8000 })
    .withMessage('exceeds_max_length'),

  check('subMessages').isEmpty().withMessage('not_allowed'),
  // check('images').isEmpty().withMessage('not_allowed'),
  check('createdAt').isEmpty().withMessage('not_allowed'),
  check('updatedAt').isEmpty().withMessage('not_allowed'),

  validatorMiddleware,
];

export const updateOfferValidator = [
  check('id').notEmpty().withMessage('is_required').isMongoId().withMessage('invalid_MongoId'),

  check('price').optional().isNumeric().withMessage('invalid_input').isLength({ min: 5 }).withMessage('min_length'),
  check('message').optional().isLength({ max: 8000 }).withMessage('exceeds_max_length'),

  check('taskId').isEmpty().withMessage('not_allowed'),
  check('taskerId').isEmpty().withMessage('not_allowed'),
  check('subMessages').isEmpty().withMessage('not_allowed'),
  // check('images').isEmpty().withMessage('not_allowed'),
  check('createdAt').isEmpty().withMessage('not_allowed'),
  check('updatedAt').isEmpty().withMessage('not_allowed'),
  validatorMiddleware,
];
