import { check } from 'express-validator';
import validatorMiddleware from '../errors/validation.middleware';
export const createServiceValidator = [
    check('name').notEmpty().withMessage('Service name is required').isString().withMessage('Service name must be a string'),
    validatorMiddleware,
];
