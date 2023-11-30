import { check } from 'express-validator';

import validatorMiddleware from '../../errors/validation.middleware';

export const createOfferValidator = [
  check('taskId').notEmpty().withMessage('Task ID is required').isMongoId().withMessage('Task ID must be a valid mongo ID'),
  check('message')
    .notEmpty()
    .withMessage('Message is required')
    .isString()
    .withMessage('Message must be a string')
    .isLength({ max: 8000 })
    .withMessage('Message must be less than 6000 characters'),
  check('subMessages').isEmpty().withMessage('Sub messages is not allowed to be updated in this route'),
  check('images').isEmpty().withMessage('Images is not allowed to be updated in this route'),
  check('createdAt').isEmpty().withMessage('createdAt is not allowed to be updated in this route'),
  check('updatedAt').isEmpty().withMessage('updatedAt is not allowed to be updated in this route'),

  validatorMiddleware,
];

export const updateOfferValidator = [
  check('taskId').isEmpty().withMessage('Task ID is not allowed to be updated in this route'),
  check('taskerId').isEmpty().withMessage('Tasker ID is not allowed to be updated in this route'),
  check('message').optional().isString().withMessage('Message must be a string').isLength({ max: 8000 }).withMessage('Message must be less than 6000 characters'),
  check('subMessages').isEmpty().withMessage('Sub messages is not allowed to be updated in this route'),
  check('images').isEmpty().withMessage('Images is not allowed to be updated in this route'),
  check('createdAt').isEmpty().withMessage('createdAt is not allowed to be updated in this route'),
  check('updatedAt').isEmpty().withMessage('updatedAt is not allowed to be updated in this route'),

  validatorMiddleware,
];
