import { check } from 'express-validator';

import { TaskTime } from '../../interfaces';
import validatorMiddleware from '../errors/validation.middleware';

export const createTaskValidator = [
  // ====================>>>>>>>> required <<<<<<<<<<<==================== //
  check('title').isString().withMessage('invalid_input').isLength({ max: 300, min: 5 }).withMessage('title_lenght'),
  check('categoryId').isMongoId().withMessage('invalid_MongoId'),
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
  check('details')
    .notEmpty()
    .withMessage('is_required')
    .isString()
    .withMessage('invalid_input')
    .isLength({ max: 8000, min: 10 })
    .withMessage('details_lenght'),

  // ====================>>>>>>>> optional <<<<<<<<<<<==================== //
  check('dueDate.flexible').optional().isBoolean().withMessage('invalid_input'),
  check('dueDate.on').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('Invalid date format, must be YYYY-MM-DD'),
  check('dueDate.before').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage(' "Invalid date format, must be YYYY-MM-DD",'),
  check('dueDate').custom(dueDate => {
    if (dueDate) {
      if (dueDate.before && dueDate.on) {
        throw new Error('can not set both before and on');
      }
      if ((dueDate.flexible !== undefined && dueDate.on) || (dueDate.flexible !== undefined && dueDate.before)) {
        throw new Error('can not set both flexible and on or before');
      }
      // dueDate.flexible should be true
      if (dueDate.flexible === false && !dueDate.on && !dueDate.before) {
        throw new Error('dueDate.flexible should be true or on or before should be set');
      }
      // check if the date is in the past
      if (new Date(dueDate.before) < new Date()) {
        throw new Error('invalid_dueDate');
      }
      if (new Date(dueDate.on) < new Date()) {
        throw new Error('invalid_dueDate');
      }
    }
    return true;
  }),
  check('time')
    .optional()
    .isArray()
    .withMessage('must be an array')
    .custom(time => time.every((t: TaskTime) => Object.values(TaskTime).includes(t)))
    .withMessage('Invalid task time, must be one of MORNING, MIDDAY, AFTERNOON, EVENING'),
  check('location.online').optional().isBoolean().withMessage('invalid_input'),

  // ====================>>>>>>>> empty <<<<<<<<<<<==================== //
  check('status').isEmpty().withMessage('not_allowed'),
  check('offers').isEmpty().withMessage('not_allowed'),
  check('acceptedOffer').isEmpty().withMessage('not_allowed'),
  check('paid').isEmpty().withMessage('not_allowed'),
  check('commission').isEmpty().withMessage('not_allowed'),
  check('taskerId').isEmpty().withMessage('not_allowed'),
  check('commissionAfterDescount').isEmpty().withMessage('not_allowed'),
  check('paymentMethod').isEmpty().withMessage('not_allowed'),
  check('createdAt').isEmpty().withMessage('not_allowed'),
  check('updatedAt').isEmpty().withMessage('not_allowed'),

  validatorMiddleware,
];

export const updateTaskValidator = [
  // ====================>>>>>>>> optional <<<<<<<<<<<==================== //
  check('dueDate.flexible').optional().isBoolean().withMessage('invalid_input'),
  check('dueDate.on').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('Invalid date format, must be YYYY-MM-DD'),
  check('dueDate.before').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage(' "Invalid date format, must be YYYY-MM-DD",'),
  check('dueDate').custom(dueDate => {
    if (dueDate) {
      if (dueDate.before && dueDate.on) {
        throw new Error('can not set both before and on');
      }
      if ((dueDate.flexible !== undefined && dueDate.on) || (dueDate.flexible !== undefined && dueDate.before)) {
        throw new Error('can not set both flexible and on or before');
      }
      // dueDate.flexible should be true
      if (dueDate.flexible === false && !dueDate.on && !dueDate.before) {
        throw new Error('dueDate.flexible should be true or on or before should be set');
      }
      // check if the date is in the past
      if (new Date(dueDate.before) < new Date()) {
        throw new Error('invalid_dueDate');
      }

      if (new Date(dueDate.on) < new Date()) {
        throw new Error('invalid_dueDate');
      }
    }
    return true;
  }),
  check('time')
    .optional()
    .isArray()
    .withMessage('must be an array')
    .custom(time => time.every((t: TaskTime) => Object.values(TaskTime).includes(t)))
    .withMessage('Invalid task time, must be one of MORNING, MIDDAY, AFTERNOON, EVENING'),
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

  // ====================>>>>>>>> empty <<<<<<<<<<<==================== //
  check('offers').isEmpty().withMessage('not_allowed'),
  check('status').isEmpty().withMessage('not_allowed'),
  check('taskerId').isEmpty().withMessage('not_allowed'),
  check('acceptedOffer').isEmpty().withMessage('not_allowed'),
  check('paid').isEmpty().withMessage('not_allowed'),
  check('commission').isEmpty().withMessage('not_allowed'),
  check('commissionAfterDescount').isEmpty().withMessage('not_allowed'),
  check('paymentMethod').isEmpty().withMessage('not_allowed'),
  check('taskerId').isEmpty().withMessage('not_allowed'),
  check('createdAt').isEmpty().withMessage('not_allowed'),
  check('updatedAt').isEmpty().withMessage('not_allowed'),
  validatorMiddleware,
];
