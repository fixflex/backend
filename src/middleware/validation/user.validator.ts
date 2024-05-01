import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const updateLoggedUserValidator = [
  // ====================>>>>>>>>  optional <<<<<<<<<<<==================== //
  check('name').optional().isString().withMessage('invalid_input'),
  check('email').optional().isEmail().withMessage('invalid_email'),
  check('password').isEmpty().withMessage('not_allowed'),
  check('phoneNumber').optional().isMobilePhone('ar-EG').withMessage('invalid_phone_number'),

  // ====================>>>>>>>>  empty <<<<<<<<<<<==================== //
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
  check('newPassword').notEmpty().withMessage('is_required').isLength({ min: 8 }).withMessage('invalid_password'),

  validatorMiddleware,
];
