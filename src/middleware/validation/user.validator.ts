import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const updateLoggedUserValidator = [
  check('name').optional().isString().withMessage('invalid_input'),
  check('email').optional().isEmail().withMessage('invalid_email'),
  check('password').isEmpty().withMessage('not_allowed'),
  // check('phoneNumber').notEmpty().withMessage('this_field_is_required').isMobilePhone('ar-EG').withMessage('invalid_phone_number'),
  // check('phoneNumber').optional().isMobilePhone('ar-EG').withMessage('invalid_phone_number'),
  // check('location')
  //   .optional()
  //   .isArray()
  //   .withMessage('Coordinates must be an array of numbers')
  //   // check if coordinates are valid numbers (longitude, latitude) [x, y]
  //   .custom(coordinates => {
  //     if (coordinates.length !== 2) {
  //       throw new Error('Coordinates must be an array of 2 numbers');
  //     }
  //     if (typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number') {
  //       throw new Error('Coordinates must be an array of 2 numbers');
  //     }
  //     return true;
  //   }),

  check('role').isEmpty().withMessage('not_allowed'),
  check('active').isEmpty().withMessage('not_allowed'),
  check('createdAt').isEmpty().withMessage('not_allowed'),
  check('updatedAt').isEmpty().withMessage('not_allowed'),
  check('_id').isEmpty().withMessage('not_allowed'),

  validatorMiddleware,
];

export const getUserValidator = [
  check('id').notEmpty().withMessage('is_required').isMongoId().withMessage('invalid_MongoId'),
  validatorMiddleware,
];
export const deleteUserValidator = [
  check('id').notEmpty().withMessage('is_required').isMongoId().withMessage('invalid_MongoId'),
  validatorMiddleware,
];

export const changePasswordValidator = [
  check('oldPassword').notEmpty().withMessage('is_required'),
  // .custom((oldPassword, { req }) => req.body.newPassword !== oldPassword)
  // .withMessage('New password must be different from old password'),
  check('newPassword').notEmpty().withMessage('is_required').isLength({ min: 8 }).withMessage('invalid_password'),

  validatorMiddleware,
];
