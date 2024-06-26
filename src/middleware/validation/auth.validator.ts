import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const signupValidator = [
  // ====================>>>>>>>>  required  <<<<<<<<<<<==================== //
  check('firstName').notEmpty().withMessage('is_required').isString().withMessage('invalid_input'),
  check('lastName').notEmpty().withMessage('is_required').isString().withMessage('invalid_input'),
  check('email').notEmpty().withMessage('is_required').isEmail().withMessage('invalid_email'),
  check('password').notEmpty().withMessage('is_required').isLength({ min: 8 }).withMessage('invalid_password'),

  // ====================>>>>>>>>  optional  <<<<<<<<<<<==================== //
  check('phoneNumber').optional().isMobilePhone('ar-EG').withMessage('invalid_phone_number'),

  // ====================>>>>>>>>  empty  <<<<<<<<<<<==================== //
  check('role').isEmpty().withMessage('not_allowed'),
  check('active').isEmpty().withMessage('not_allowed'),
  validatorMiddleware,
];

export const loginValidator = [
  check('email').notEmpty().withMessage('is_required').isEmail().withMessage('invalid_email'),
  check('password').notEmpty().withMessage('is_required').isLength({ min: 8 }).withMessage('Invalid_Password'),

  validatorMiddleware,
];
