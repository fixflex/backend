import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createReviewValidator = [
  // ====================>>>>>>>> is required <<<<<<<<<<<==================== //
  check('taskId').isMongoId().withMessage('invalid_MongoId'),
  check('rating').isNumeric().withMessage('invalid_input').isInt({ min: 0, max: 5 }).withMessage('invalid_rating'),
  check('review').isString().withMessage('invalid_input').isLength({ max: 8000, min: 5 }).withMessage('review_lenght'),

  // ====================>>>>>>>> is empty <<<<<<<<<<<==================== //
  check('userId').isEmpty().withMessage('not_allowed'),

  validatorMiddleware,
];

export const updateReviewValidator = [
  // ====================>>>>>>>> is required <<<<<<<<<<<==================== //
  check('rating').optional().isNumeric().withMessage('invalid_input').isInt({ min: 0, max: 5 }).withMessage('invalid_rating'),
  check('review').optional().isString().withMessage('invalid_input').isLength({ max: 8000, min: 5 }).withMessage('review_lenght'),

  // ====================>>>>>>>> is empty <<<<<<<<<<<==================== //
  check('userId').isEmpty().withMessage('not_allowed'),
  check('taskId').isEmpty().withMessage('not_allowed'),

  validatorMiddleware,
];
