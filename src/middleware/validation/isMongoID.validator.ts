// is mongodb id validator
import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const isMongoId = [check('id').notEmpty().withMessage('is_required').isMongoId().withMessage('invalid_MongoId'), validatorMiddleware];
