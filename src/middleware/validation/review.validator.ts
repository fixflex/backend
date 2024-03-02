import { body } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createReviewValidator = [
  // ====================>>>>>>>> is required <<<<<<<<<<<==================== //
  body('taskId').notEmpty().withMessage('required').isMongoId().withMessage('invalid_MongoId'),
  body('rating').isNumeric().withMessage('invalid_input').isFloat({ min: 0, max: 5 }).withMessage('invalid_rating'),
  body('review').isString().withMessage('invalid_input').isLength({ max: 8000, min: 5 }).withMessage('review_lenght'),

  // ====================>>>>>>>> is empty <<<<<<<<<<<==================== //
  body('userId').isEmpty().withMessage('not_allowed'),

  validatorMiddleware,
];

export const updateReviewValidator = [
  // ====================>>>>>>>> is required <<<<<<<<<<<==================== //
  body('id').isMongoId().withMessage('invalid_MongoId'),
  body('rating').optional().isNumeric().withMessage('invalid_input').isFloat({ min: 0, max: 5 }).withMessage('invalid_rating'),
  body('review').optional().isString().withMessage('invalid_input').isLength({ max: 8000, min: 5 }).withMessage('review_lenght'),

  // ====================>>>>>>>> is empty <<<<<<<<<<<==================== //
  body('userId').isEmpty().withMessage('not_allowed'),
  body('taskId').isEmpty().withMessage('not_allowed'),

  validatorMiddleware,
];
