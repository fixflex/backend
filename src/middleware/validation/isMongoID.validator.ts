// is mongodb id validator
import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const isMongoId = [check('id').notEmpty().withMessage('id is required').isMongoId().withMessage('Invalid id format '), validatorMiddleware];
