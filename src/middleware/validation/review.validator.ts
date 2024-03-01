import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createReviewValidator = [
  // ====================>>>>>>>> is required <<<<<<<<<<<==================== //
  check('taskId').isMongoId().withMessage('invalid_MongoId'),
  // rating should be between 0 and 5 could be 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5 to do that we need to use isFloat
  check('rating').isNumeric().withMessage('invalid_input').isFloat({ min: 0, max: 5 }).withMessage('invalid_rating'),
  check('review').isString().withMessage('invalid_input').isLength({ max: 8000, min: 5 }).withMessage('review_lenght'),

  // ====================>>>>>>>> is empty <<<<<<<<<<<==================== //
  check('userId').isEmpty().withMessage('not_allowed'),

  validatorMiddleware,
];

export const updateReviewValidator = [
  // ====================>>>>>>>> is required <<<<<<<<<<<==================== //
  check('id').isMongoId().withMessage('invalid_MongoId'),
  check('rating').optional().isNumeric().withMessage('invalid_input').isFloat({ min: 0, max: 5 }).withMessage('invalid_rating'),
  check('review').optional().isString().withMessage('invalid_input').isLength({ max: 8000, min: 5 }).withMessage('review_lenght'),

  // ====================>>>>>>>> is empty <<<<<<<<<<<==================== //
  check('userId').isEmpty().withMessage('not_allowed'),
  check('taskId').isEmpty().withMessage('not_allowed'),

  validatorMiddleware,
];
