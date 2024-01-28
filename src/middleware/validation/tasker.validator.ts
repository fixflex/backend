import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const getTaskersValidator = [
  check('longitude').optional().isNumeric().withMessage('this_field_must_be_a_number'),
  check('latitude').optional().isNumeric().withMessage('this_field_must_be_a_number'),
  check('categories').optional().isMongoId().withMessage('invalid_MongoId'),
  validatorMiddleware,
];

export const createTaskerValidator = [
  check('categories').isArray().withMessage('this_field_must_be_an_array').isLength({ min: 1 }).withMessage('this_field_is_required'),
  check('categories.*').isMongoId().withMessage('invalid_MongoId'),
  //         "location": {
  // "coordinates": [32.1617485, 26.0524745]
  // }
  // custom validator to check if coordinates are valid numbers (longitude, latitude) [x, y]
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
      // swap the coordinates to be [longitude, latitude] [x, y]
      location.coordinates = [location.coordinates[1], location.coordinates[0]];
      return true;
    }),

  //  ckeck that the phone number is valid  and be from egypt
  check('phoneNumber').notEmpty().withMessage('this_field_is_required').isMobilePhone('ar-EG').withMessage('invalid_phone_number'),
  // https://www.npmjs.com/package/google-libphonenumber
  check('rating').isEmpty().withMessage('not_allowed'),
  check('completedTasks').isEmpty().withMessage('not_allowed'),

  validatorMiddleware,
];

export const updateTaskerValidator = [
  check('categories').isEmpty().withMessage('not_allowed'),
  // check('categories').optional().isArray().withMessage('Services must be an array').isLength({ min: 1 }).withMessage('Services must have at least one service'),
  // check('categories.*').optional().isMongoId().withMessage('Service must be a valid mongo ID'),
  check('location')
    .optional()
    .custom(location => {
      if (location.coordinates.length !== 2) {
        throw new Error('invalid_coordinates');
      }
      if (typeof location.coordinates[0] !== 'number' || typeof location.coordinates[1] !== 'number') {
        throw new Error('invalid_coordinates');
      }
      // swap the coordinates to be [longitude, latitude] [x, y]
      location.coordinates = [location.coordinates[1], location.coordinates[0]];
      return true;
    }),
  check('bio')
    .optional()
    .isString()
    .withMessage('invalid_input')
    .isLength({ max: 8000 })
    .withMessage('this_field_must_be_less_than_8000_characters'),
  check('rating').isEmpty().withMessage('not_allowed'),
  check('completedTasks').isEmpty().withMessage('not_allowed'),
  check('phoneNumber').optional().isMobilePhone('ar-EG').withMessage('invalid_phone_number'),
  validatorMiddleware,
];
