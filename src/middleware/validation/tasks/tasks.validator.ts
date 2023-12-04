import { check } from 'express-validator';

import validatorMiddleware from '../../errors/validation.middleware';

export const createTaskValidator = [
  check('ownerId').notEmpty().withMessage('Owner ID is required').isMongoId().withMessage('Owner ID must be a valid mongo ID'),

  // TODO: check if the date is valid / fix the error message
  // check('dueDate.start').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('Start date must be a valid date'), // some thing like this: 2021-12-31
  // check('dueDate.end').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('End date must be a valid date'),
  check('dueDate.flexible').optional().isBoolean().withMessage('Flexible must be a boolean'),
  check('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 200, min: 10 })
    .withMessage('Title must be less than 10 characters'),
  check('details')
    .notEmpty()
    .withMessage('Details is required')
    .isString()
    .withMessage('Details must be a string')
    .isLength({ max: 8000, min: 24 })
    .withMessage('Details must be less than 8000 characters'),
  check('service').notEmpty().withMessage('Service is required').isMongoId().withMessage('Service must be a valid mongo ID'),
  check('location')
    .notEmpty()
    .withMessage('Location is required')
    .custom(location => {
      if (location.coordinates.length !== 2) {
        throw new Error('location.Coordinates must be an array of 2 numbers');
      }
      if (typeof location.coordinates[0] !== 'number' || typeof location.coordinates[1] !== 'number') {
        throw new Error('Coordinates must be an array of 2 numbers');
      }
      return true;
    }),
  check('budget').notEmpty().withMessage('Budget is required').isNumeric().withMessage('Budget must be a number'),
  check('status').isEmpty().withMessage('Status is not allowed to be updated in this route'),
  check('offers').isEmpty().withMessage('Offers is not allowed to be updated in this route'),
  check('createdAt').isEmpty().withMessage('createdAt is not allowed to be updated in this route'),
  check('updatedAt').isEmpty().withMessage('updatedAt is not allowed to be updated in this route'),
  validatorMiddleware,
];

export const updateTaskValidator = [
  check('ownerId').isEmpty().withMessage('Owner ID is not allowed to be updated in this route'),
  // check('dueDate.start').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('Start date must be a valid date'), // some thing like this: 2021-12-31
  // check('dueDate.end').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('End date must be a valid date'),
  check('dueDate.flexible').optional().isBoolean().withMessage('Flexible must be a boolean'),
  check('title').optional().isString().withMessage('Title must be a string').isLength({ max: 200, min: 10 }).withMessage('Title must be less than 10 characters'),
  check('details').optional().isString().withMessage('Details must be a string').isLength({ max: 8000, min: 24 }).withMessage('Details must be less than 8000 characters'),
  check('service').optional().isMongoId().withMessage('Service must be a valid mongo ID'),
  check('location')
    .optional()
    .custom(location => {
      if (location.coordinates.length !== 2) {
        throw new Error('location.Coordinates must be an array of 2 numbers');
      }
      if (typeof location.coordinates[0] !== 'number' || typeof location.coordinates[1] !== 'number') {
        throw new Error('Coordinates must be an array of 2 numbers');
      }
      return true;
    }),
  check('budget').optional().isNumeric().withMessage('Budget must be a number'),
  check('status').optional().isIn(['OPEN', 'IN_PROGRESS', 'DONE']).withMessage('Status must be one of these: OPEN, IN_PROGRESS, DONE'),
  check('offers').isEmpty().withMessage('Offers is not allowed to be updated in this route'),
  check('createdAt').isEmpty().withMessage('createdAt is not allowed to be updated in this route'),
  check('updatedAt').isEmpty().withMessage('updatedAt is not allowed to be updated in this route'),
  validatorMiddleware,
];
