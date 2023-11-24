import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const signupValidator = [
  check('firstName').notEmpty().withMessage('firstName is required').isString().withMessage('Name must be a string'),

  check('lastName').notEmpty().withMessage('lastName is required').isString().withMessage('Name must be a string'),

  check('email').notEmpty().withMessage('User email is required').isEmail().withMessage('Email is invalid'),

  check('password').notEmpty().withMessage('User password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

  check('role').isEmpty().withMessage('Role is not allowed'),
  check('active').isEmpty().withMessage('Active is not allowed'),
  validatorMiddleware,
];

export const loginValidator = [
  check('email').notEmpty().withMessage('User email is required').isEmail().withMessage('Email is invalid'),

  check('password').notEmpty().withMessage('User password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

  validatorMiddleware,
];
