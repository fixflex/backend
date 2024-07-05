import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const getTaskersValidator = [
  check('longitude').optional().isNumeric().withMessage('this_field_must_be_a_number'),
  check('latitude').optional().isNumeric().withMessage('this_field_must_be_a_number'),
  check('categories').optional().isMongoId().withMessage('invalid_MongoId'),
  validatorMiddleware,
];

export const createTaskerValidator = [
  // ====================>>>>>>>> required <<<<<<<<<<<==================== //
  check('categories').isArray().withMessage('this_field_must_be_an_array').isLength({ min: 1 }).withMessage('this_field_is_required'),
  check('categories.*').isMongoId().withMessage('invalid_MongoId'),
  check('location')
    .notEmpty()
    .withMessage('this_field_is_required')
    .custom(location => {
      if (location.coordinates.length !== 2) {
        throw new Error('invalid_coordinates');
      }
      if (typeof location.coordinates[0] !== 'number' || typeof location.coordinates[1] !== 'number') {
        throw new Error('invalid_coordinates');
      }

      return true;
    }),

  // ====================>>>>>>>> empty <<<<<<<<<<<==================== //
  check('rating').isEmpty().withMessage('not_allowed'),
  check('completedTasks').isEmpty().withMessage('not_allowed'),
  check('isActive').isEmpty().withMessage('not_allowed'),
  validatorMiddleware,
];

export const updateTaskerValidator = [
  // ====================>>>>>>>> optional <<<<<<<<<<<==================== //
  check('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array')
    .isLength({ min: 1 })
    .withMessage('Categories must have at least one service'),
  check('categories.*').optional().isMongoId().withMessage('Category must be a valid mongo ID'),
  check('location')
    .optional()
    .custom(location => {
      if (location.coordinates.length !== 2) {
        throw new Error('invalid_coordinates');
      }
      if (typeof location.coordinates[0] !== 'number' || typeof location.coordinates[1] !== 'number') {
        throw new Error('invalid_coordinates');
      }

      return true;
    }),
  check('phoneNumber').optional().isMobilePhone('ar-EG').withMessage('invalid_phone_number'),
  check('bio')
    .optional()
    .isString()
    .withMessage('invalid_input')
    .isLength({ max: 8000 })
    .withMessage('this_field_must_be_less_than_8000_characters'),
  check('isActive').optional().isBoolean().withMessage('invalid_input'),

  // ====================>>>>>>>> empty <<<<<<<<<<<==================== //
  check('completedTasks').isEmpty().withMessage('not_allowed'),
  check('rating').isEmpty().withMessage('not_allowed'),
  validatorMiddleware,
];
