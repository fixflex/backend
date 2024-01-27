import { check } from 'express-validator';

import { TaskStatus, TaskTime } from '../../interfaces';
import validatorMiddleware from '../errors/validation.middleware';

export const createTaskValidator = [
  check('category').optional().isMongoId().withMessage('invalid_MongoId'),
  check('title').isString().withMessage('invalid_input').isLength({ max: 200, min: 5 }).withMessage('title_lenght'),
  check('details')
    .notEmpty()
    .withMessage('is_required')
    .isString()
    .withMessage('invalid_input')
    .isLength({ max: 8000, min: 10 })
    .withMessage('details_lenght'),
  check('dueDate.flexible').optional().isBoolean().withMessage('invalid_input'),
  check('dueDate.on').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('Invalid date format, must be YYYY-MM-DD'),

  check('dueDate.before').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage(' "Invalid date format, must be YYYY-MM-DD",'),
  check('time')
    .optional()
    .isArray()
    .withMessage('must be an array')
    .custom(time => time.every((t: TaskTime) => Object.values(TaskTime).includes(t)))
    .withMessage('Invalid task time, must be one of MORNING, MIDDAY, AFTERNOON, EVENING'),
  check('location.online').optional().isBoolean().withMessage('invalid_input'),
  check('location')
    .notEmpty()
    .withMessage('is_required')
    .custom(location => {
      if (location.online) return true;
      if (!location.coordinates || location.coordinates.length !== 2) {
        throw new Error('invalid_coordinates');
      }
      if (typeof location.coordinates[0] !== 'number' || typeof location.coordinates[1] !== 'number') {
        throw new Error('invalid_coordinates');
      }
      return true;
    }),
  check('budget')
    .notEmpty()
    .withMessage('is_required')
    .isNumeric()
    .withMessage('invalid_input')
    .isInt({ min: 10 })
    .withMessage('invalid_budget'),

  check('status').isEmpty().withMessage('not_allowed'),
  check('offers').isEmpty().withMessage('not_allowed'),
  check('createdAt').isEmpty().withMessage('not_allowed'),
  check('updatedAt').isEmpty().withMessage('not_allowed'),
  validatorMiddleware,
];

export const updateTaskValidator = [
  check('dueDate.flexible').optional().isBoolean().withMessage('invalid_input'),
  check('title').optional().isString().withMessage('invalid_input').isLength({ max: 200, min: 5 }).withMessage('title_lenght'),
  check('details').optional().isString().withMessage('invalid_input').isLength({ max: 8000, min: 10 }).withMessage('details_lenght'),
  check('category').optional().isMongoId().withMessage('invalid_MongoId'),
  check('location.online').optional().isBoolean().withMessage('invalid_input'),
  check('location')
    .optional()
    .custom(location => {
      if (location.online) return true;
      if (location.coordinates)
        if (
          location.coordinates.length !== 2 ||
          typeof location.coordinates[0] !== 'number' ||
          typeof location.coordinates[1] !== 'number'
        ) {
          throw new Error('invalid_coordinates');
        }
      return true;
    }),
  check('budget').optional().isNumeric().withMessage('invalid_input'),
  check('status').optional().isIn(Object.values(TaskStatus)).withMessage('invalid_status'),

  check('offers').isEmpty().withMessage('not_allowed'),
  check('taskerId').isEmpty().withMessage('not_allowed'),
  check('createdAt').isEmpty().withMessage('not_allowed'),
  check('updatedAt').isEmpty().withMessage('not_allowed'),
  validatorMiddleware,
];
