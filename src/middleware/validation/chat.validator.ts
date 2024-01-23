import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createChatValidator = [check('client').isMongoId().withMessage('invalid_MongoId'), check('tasker').isMongoId().withMessage('invalid_MongoId'), validatorMiddleware];
