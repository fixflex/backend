import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createTaskValidator = [
  check('ownerId').notEmpty().withMessage('Owner ID is required').isMongoId().withMessage('Owner ID must be a valid mongo ID'),

  // TODO: check if the date is valid / fix the error message
  // check('dueDate.start').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('Start date must be a valid date'), // some thing like this: 2021-12-31
  // check('dueDate.end').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('End date must be a valid date'),
  check('dueDate.flexible').optional().isBoolean().withMessage('must_be_a_boolean'),
  check('title')
    .notEmpty()
    .withMessage('is_required')
    .isString()
    .withMessage('invalid_input')
    .isLength({ max: 200, min: 10 })
    // should be 10 characters at least
    .withMessage('title_lenght'),
  check('details').notEmpty().withMessage('is_required').isString().withMessage('invalid_input').isLength({ max: 8000, min: 10 }).withMessage('details_lenght'),
  check('service').notEmpty().withMessage('is_required').isMongoId().withMessage('invalid_MongoId'),
  check('location')
    .notEmpty()
    .withMessage('is_required')
    .custom(location => {
      if (location.coordinates.length !== 2) {
        throw new Error('invalid_coordinates');
      }
      if (typeof location.coordinates[0] !== 'number' || typeof location.coordinates[1] !== 'number') {
        throw new Error('invalid_coordinates');
      }
      return true;
    }),
  check('budget').notEmpty().withMessage('is_required').isNumeric().withMessage('invalid_input'),
  check('status').isEmpty().withMessage('not_allowed'),
  check('offers').isEmpty().withMessage('not_allowed'),
  check('createdAt').isEmpty().withMessage('not_allowed'),
  check('updatedAt').isEmpty().withMessage('not_allowed'),
  validatorMiddleware,
];

export const updateTaskValidator = [
  check('ownerId').isEmpty().withMessage('not_allowed'),
  // check('dueDate.start').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('Start date must be a valid date'), // some thing like this: 2021-12-31
  // check('dueDate.end').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('End date must be a valid date'),
  check('dueDate.flexible').optional().isBoolean().withMessage('invalid_input'),
  check('title').optional().isString().withMessage('invalid_input').isLength({ max: 200, min: 10 }).withMessage('title_lenght'),
  check('details').optional().isString().withMessage('invalid_input').isLength({ max: 8000, min: 24 }).withMessage('details_lenght'),
  check('service').optional().isMongoId().withMessage('invalid_MongoId'),
  check('location')
    .optional()
    .custom(location => {
      if (location.coordinates.length !== 2) {
        throw new Error('ivalid_coordinates');
      }
      if (typeof location.coordinates[0] !== 'number' || typeof location.coordinates[1] !== 'number') {
        throw new Error('invalid_coordinates');
      }
      return true;
    }),
  check('budget').optional().isNumeric().withMessage('invalid_input'),
  check('status').optional().isIn(['OPEN', 'ASSIGNED', 'COMPLETED']).withMessage('invalid_task_status'),
  check('offers').isEmpty().withMessage('not_allowed'),
  check('createdAt').isEmpty().withMessage('not_allowed'),
  check('updatedAt').isEmpty().withMessage('not_allowed'),
  validatorMiddleware,
];
