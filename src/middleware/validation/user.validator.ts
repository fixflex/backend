import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const updateLoggedUserValidator = [
  // ====================>>>>>>>>  optional <<<<<<<<<<<==================== //
  check('name').optional().isString().withMessage('invalid_input'),
  check('email').optional().isEmail().withMessage('invalid_email'),
  check('phoneNumber').optional().isMobilePhone('ar-EG').withMessage('invalid_phone_number'),
  check('active').optional().isBoolean().withMessage('invalid_input'),

  // ====================>>>>>>>>  empty <<<<<<<<<<<==================== //
  check('password').isEmpty().withMessage('not_allowed'),
  check('role').isEmpty().withMessage('not_allowed'),
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
  check('newPassword').notEmpty().withMessage('is_required').isLength({ min: 8 }).withMessage('invalid_password'),

  validatorMiddleware,
];
