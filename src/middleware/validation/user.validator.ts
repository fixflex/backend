import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createUserValidator = [
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

  validatorMiddleware,
];

export const updateUserValidator = [
  check('id')
    .notEmpty()
    .withMessage('User id is required')
    .isMongoId()
    .withMessage('Invalid user id format '),

  check('name').optional().isString().withMessage('Name must be a string'),

  check('email').optional().isEmail().withMessage('invalid email address'),

  check('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  check('confirmPassword')
    .optional()
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error('Passwords must match');
      }
      return true;
    }),

  validatorMiddleware,
];

export const getUserValidator = [
  check('id')
    .notEmpty()
    .withMessage('User id is required')
    .isMongoId()
    .withMessage('Invalid user id format '),

  validatorMiddleware,
];
export const deleteUserValidator = [
  check('id')
    .notEmpty()
    .withMessage('User id is required')
    .isMongoId()
    .withMessage('Invalid user id format '),

  validatorMiddleware,
];
