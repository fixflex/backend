import { check } from 'express-validator';

import validatorMiddleware from '../../errors/validation.middleware';

export const getTaskersValidator = [
  check('longitude').optional().isNumeric().withMessage('Longitude must be a number'),
  check('latitude').optional().isNumeric().withMessage('Latitude must be a number'),
  check('services').optional().isMongoId().withMessage('Service must be a valid mongo ID'),
  validatorMiddleware,
];

export const createTaskerValidator = [
  check('services').isArray().withMessage('Services must be an array').isLength({ min: 1 }).withMessage('Services must have at least one service'),
  check('services.*').isMongoId().withMessage('Service must be a valid mongo ID'),
  //         "location": {
  // "coordinates": [32.1617485, 26.0524745]
  // }
  // custom validator to check if coordinates are valid numbers (longitude, latitude) [x, y]
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

  //  ckeck that the phone number is valid  and be from egypt
  check('phoneNumber').notEmpty().withMessage('Phone number is required').isMobilePhone('ar-EG').withMessage('Invalid phone number'),
  // https://www.npmjs.com/package/google-libphonenumber
  check('rating').isEmpty().withMessage('Rating is not allowed'),
  check('completedTasks').isEmpty().withMessage('Completed tasks is not allowed'),

  validatorMiddleware,
];

export const updateTaskerValidator = [
  check('services').optional().isArray().withMessage('Services must be an array').isLength({ min: 1 }).withMessage('Services must have at least one service'),
  check('services.*').optional().isMongoId().withMessage('Service must be a valid mongo ID'),
  check('bio').optional().isString().withMessage('Bio must be a string'),
  check('rating').isEmpty().withMessage('Rating is not allowed'),
  check('completedTasks').isEmpty().withMessage('Completed tasks is not allowed'),

  validatorMiddleware,
];
