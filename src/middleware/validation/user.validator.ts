import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const updateLoggedUserValidator = [
  check('name').optional().isString().withMessage('Name must be a string'),
  check('email').optional().isEmail().withMessage('invalid email address'),
  check('password').isEmpty().withMessage('Cannot change password from here'),

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

  check('role').isEmpty().withMessage('Role is not allowed'),
  check('active').isEmpty().withMessage('Active is not allowed'),
  check('createdAt').isEmpty().withMessage('createdAt is not allowed'),
  check('updatedAt').isEmpty().withMessage('updatedAt is not allowed'),
  check('_id').isEmpty().withMessage('_id is not allowed'),

  validatorMiddleware,
];

export const getUserValidator = [check('id').notEmpty().withMessage('User id is required').isMongoId().withMessage('Invalid user id format '), validatorMiddleware];
export const deleteUserValidator = [check('id').notEmpty().withMessage('User id is required').isMongoId().withMessage('Invalid user id format '), validatorMiddleware];

export const changePasswordValidator = [
  check('oldPassword')
    .notEmpty()
    .withMessage('Old password is required')
    .custom((oldPassword, { req }) => req.body.newPassword !== oldPassword)
    .withMessage('New password must be different from old password'),
  check('newPassword').notEmpty().withMessage('User newPassword is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

  validatorMiddleware,
];

// ===================  =====================

// export const updateUserValidator = [
//   check('id')
//     .notEmpty()
//     .withMessage('User id is required')
//     .isMongoId()
//     .withMessage('Invalid user id format '),

//   check('name').optional().isString().withMessage('Name must be a string'),

//   check('email').optional().isEmail().withMessage('invalid email address'),

//   check('password')
//     .optional()
//     .isLength({ min: 8 })
//     .withMessage('Password must be at least 8 characters'),

//   check('confirmPassword')
//     .optional()
//     .custom((confirmPassword, { req }) => {
//       if (confirmPassword !== req.body.password) {
//         throw new Error('Passwords must match');
//       }
//       return true;
//     }),

//   validatorMiddleware,
// ];

// port const createUserValidator = [
//   check('firstName')
//     .notEmpty()
//     .withMessage('firstName is required')
//     .isString()
//     .withMessage('Name must be a string'),

//   check('lastName')
//     .notEmpty()
//     .withMessage('lastName is required')
//     .isString()
//     .withMessage('Name must be a string'),

//   check('email')
//     .notEmpty()
//     .withMessage('User email is required')
//     .isEmail()
//     .withMessage('Email is invalid'),

//   check('password')
//     .notEmpty()
//     .withMessage('User password is required')
//     .isLength({ min: 8 })
//     .withMessage('Password must be at least 8 characters'),

//   check('confirmPassword')
//     .notEmpty()
//     .withMessage('Confirm password is required')
//     .custom((confirmPassword, { req }) => {
//       if (confirmPassword !== req.body.password) {
//         throw new Error('Passwords must match');
//       } else {
//         return true;
//       }
//     }),

//   validatorMiddleware,
// ];
