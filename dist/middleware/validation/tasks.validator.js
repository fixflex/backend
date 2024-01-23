"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskValidator = exports.createTaskValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_middleware_1 = __importDefault(require("../errors/validation.middleware"));
exports.createTaskValidator = [
    (0, express_validator_1.check)('ownerId').notEmpty().withMessage('Owner ID is required').isMongoId().withMessage('Owner ID must be a valid mongo ID'),
    // TODO: check if the date is valid / fix the error message
    // check('dueDate.start').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('Start date must be a valid date'), // some thing like this: 2021-12-31
    // check('dueDate.end').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('End date must be a valid date'),
    (0, express_validator_1.check)('dueDate.flexible').optional().isBoolean().withMessage('must_be_a_boolean'),
    (0, express_validator_1.check)('title')
        .notEmpty()
        .withMessage('is_required')
        .isString()
        .withMessage('invalid_input')
        .isLength({ max: 200, min: 10 })
        // should be 10 characters at least
        .withMessage('title_lenght'),
    (0, express_validator_1.check)('details').notEmpty().withMessage('is_required').isString().withMessage('invalid_input').isLength({ max: 8000, min: 10 }).withMessage('details_lenght'),
    (0, express_validator_1.check)('service').notEmpty().withMessage('is_required').isMongoId().withMessage('invalid_MongoId'),
    (0, express_validator_1.check)('location')
        .notEmpty()
        .withMessage('is_required')
        .custom(location => {
        if (location.coordinates.length !== 2) {
            throw new Error('invalid_coordinates');
        }
        if (typeof location.coordinates[0] !== 'number' || typeof location.coordinates[1] !== 'number') {
            throw new Error('invalid_coordinates');
        }
        return true;
    }),
    (0, express_validator_1.check)('budget').notEmpty().withMessage('is_required').isNumeric().withMessage('invalid_input'),
    (0, express_validator_1.check)('status').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('offers').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('createdAt').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('updatedAt').isEmpty().withMessage('not_allowed'),
    validation_middleware_1.default,
];
exports.updateTaskValidator = [
    (0, express_validator_1.check)('ownerId').isEmpty().withMessage('not_allowed'),
    // check('dueDate.start').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('Start date must be a valid date'), // some thing like this: 2021-12-31
    // check('dueDate.end').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('End date must be a valid date'),
    (0, express_validator_1.check)('dueDate.flexible').optional().isBoolean().withMessage('invalid_input'),
    (0, express_validator_1.check)('title').optional().isString().withMessage('invalid_input').isLength({ max: 200, min: 10 }).withMessage('title_lenght'),
    (0, express_validator_1.check)('details').optional().isString().withMessage('invalid_input').isLength({ max: 8000, min: 24 }).withMessage('details_lenght'),
    (0, express_validator_1.check)('service').optional().isMongoId().withMessage('invalid_MongoId'),
    (0, express_validator_1.check)('location')
        .optional()
        .custom(location => {
        if (location.coordinates.length !== 2) {
            throw new Error('ivalid_coordinates');
        }
        if (typeof location.coordinates[0] !== 'number' || typeof location.coordinates[1] !== 'number') {
            throw new Error('invalid_coordinates');
        }
        return true;
    }),
    (0, express_validator_1.check)('budget').optional().isNumeric().withMessage('invalid_input'),
    (0, express_validator_1.check)('status').optional().isIn(['OPEN', 'ASSIGNED', 'COMPLETED']).withMessage('invalid_task_status'),
    (0, express_validator_1.check)('offers').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('createdAt').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('updatedAt').isEmpty().withMessage('not_allowed'),
    validation_middleware_1.default,
];
