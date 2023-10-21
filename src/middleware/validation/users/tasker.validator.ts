import { check } from 'express-validator';

import validatorMiddleware from '../../errors/validation.middleware';

export const createTaskerValidator = [
  check('services').isArray().withMessage('Services must be an array').isLength({ min: 1 }).withMessage('Services must have at least one service'),
  check('services.*').isMongoId().withMessage('Service must be a valid mongo ID'),
  check('bio').optional().isString().withMessage('Bio must be a string'),
  check('rating').isEmpty().withMessage('Rating is not allowed'),
  check('completedTasks').isEmpty().withMessage('Completed tasks is not allowed'),

  validatorMiddleware,
];

export const updateTaskerValidator = [
  check('services')
    .optional()
    .isArray()
    .withMessage('Services must be an array')
    .isLength({ min: 1 })
    .withMessage('Services must have at least one service'),
  check('services.*').optional().isMongoId().withMessage('Service must be a valid mongo ID'),
  check('bio').optional().isString().withMessage('Bio must be a string'),
  check('rating').isEmpty().withMessage('Rating is not allowed'),
  check('completedTasks').isEmpty().withMessage('Completed tasks is not allowed'),

  validatorMiddleware,
];
