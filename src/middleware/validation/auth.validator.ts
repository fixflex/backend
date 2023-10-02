import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const signupValidator = [
  check('name')
    .notEmpty()
    .withMessage('User name is required')
    .isString()
    .withMessage('Name must be a string'),

  check('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Username must be between 2 and 100 characters'),

  check('email')
    .notEmpty()
    .withMessage('User email is required')
    .isEmail()
    .withMessage('Email is invalid')
    .isLength({ min: 5, max: 100 })
    .withMessage('Email must be between 5 and 100 characters'),

  check('password')
    .notEmpty()
    .withMessage('User password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  check('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error('Passwords must match');
      } else {
        return true;
      }
    }),
  check('role')
    .optional()
    .custom(value => {
      if (value || value === '') {
        throw new Error('Role is not allowed');
      }
    }),
  check('active').isEmpty().withMessage('Active is not allowed'),
  validatorMiddleware,
];

export const loginValidator = [
  check('emailOrUsername')
    .notEmpty()
    .withMessage('Email or Username is required')
    .custom(value => {
      // Check if input is a valid email or a username
      const isValidEmail = /\S+@\S+\.\S+/.test(value);
      const isValidUsername = /^[a-zA-Z0-9_]+$/.test(value);

      if (!isValidEmail && !isValidUsername) {
        throw new Error('Input must be a valid email or username');
      }

      return true;
    }),

  check('password')
    .notEmpty()
    .withMessage('User password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  validatorMiddleware,
];
