"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskValidator = exports.createTaskValidator = void 0;
const express_validator_1 = require("express-validator");
const interfaces_1 = require("../../interfaces");
const validation_middleware_1 = __importDefault(require("../errors/validation.middleware"));
exports.createTaskValidator = [
    // ====================>>>>>>>> is required <<<<<<<<<<<==================== //
    (0, express_validator_1.check)('title').isString().withMessage('invalid_input').isLength({ max: 300, min: 5 }).withMessage('title_lenght'),
    (0, express_validator_1.check)('location')
        .notEmpty()
        .withMessage('is_required')
        .custom(location => {
        if (location.online)
            return true;
        if (!location.coordinates || location.coordinates.length !== 2) {
            throw new Error('invalid_coordinates');
        }
        if (typeof location.coordinates[0] !== 'number' || typeof location.coordinates[1] !== 'number') {
            throw new Error('invalid_coordinates');
        }
        return true;
    }),
    (0, express_validator_1.check)('budget')
        .notEmpty()
        .withMessage('is_required')
        .isNumeric()
        .withMessage('invalid_input')
        .isInt({ min: 10 })
        .withMessage('invalid_budget'),
    // ====================>>>>>>>> is optional <<<<<<<<<<<==================== //
    (0, express_validator_1.check)('category').optional().isMongoId().withMessage('invalid_MongoId'),
    (0, express_validator_1.check)('details')
        .notEmpty()
        .withMessage('is_required')
        .isString()
        .withMessage('invalid_input')
        .isLength({ max: 8000, min: 10 })
        .withMessage('details_lenght'),
    (0, express_validator_1.check)('dueDate.flexible').optional().isBoolean().withMessage('invalid_input'),
    (0, express_validator_1.check)('dueDate.on').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('Invalid date format, must be YYYY-MM-DD'),
    (0, express_validator_1.check)('dueDate.before').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage(' "Invalid date format, must be YYYY-MM-DD",'),
    (0, express_validator_1.check)('dueDate').custom(dueDate => {
        if (dueDate) {
            if (dueDate.before && dueDate.on) {
                throw new Error('can not set both before and on');
            }
            if ((dueDate.flexible !== undefined && dueDate.on) || (dueDate.flexible !== undefined && dueDate.before)) {
                throw new Error('can not set both flexible and on or before');
            }
            // dueDate.flexible should be true
            if (dueDate.flexible === false && !dueDate.on && !dueDate.before) {
                throw new Error('dueDate.flexible should be true or on or before should be set');
            }
            // check if the date is in the past
            if (new Date(dueDate.before) < new Date()) {
                throw new Error('invalid_dueDate');
            }
            if (new Date(dueDate.on) < new Date()) {
                throw new Error('invalid_dueDate');
            }
        }
        return true;
    }),
    (0, express_validator_1.check)('time')
        .optional()
        .isArray()
        .withMessage('must be an array')
        .custom(time => time.every((t) => Object.values(interfaces_1.TaskTime).includes(t)))
        .withMessage('Invalid task time, must be one of MORNING, MIDDAY, AFTERNOON, EVENING'),
    (0, express_validator_1.check)('location.online').optional().isBoolean().withMessage('invalid_input'),
    // ====================>>>>>>>> is empty <<<<<<<<<<<==================== //
    (0, express_validator_1.check)('status').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('offers').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('acceptedOffer').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('paid').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('commission').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('commissionAfterDescount').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('paymentMethod').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('createdAt').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('updatedAt').isEmpty().withMessage('not_allowed'),
    validation_middleware_1.default,
];
/**
 *
 * @description this validator is used to validate the update task request
 * @see src/routes/task.route.ts
 *
 */
exports.updateTaskValidator = [
    // ====================>>>>>>>> is optional <<<<<<<<<<<==================== //
    (0, express_validator_1.check)('dueDate.flexible').optional().isBoolean().withMessage('invalid_input'),
    (0, express_validator_1.check)('dueDate.on').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('Invalid date format, must be YYYY-MM-DD'),
    (0, express_validator_1.check)('dueDate.before').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage(' "Invalid date format, must be YYYY-MM-DD",'),
    (0, express_validator_1.check)('dueDate').custom(dueDate => {
        if (dueDate) {
            if (dueDate.before && dueDate.on) {
                throw new Error('can not set both before and on');
            }
            if ((dueDate.flexible !== undefined && dueDate.on) || (dueDate.flexible !== undefined && dueDate.before)) {
                throw new Error('can not set both flexible and on or before');
            }
            // dueDate.flexible should be true
            if (dueDate.flexible === false && !dueDate.on && !dueDate.before) {
                throw new Error('dueDate.flexible should be true or on or before should be set');
            }
            // check if the date is in the past
            if (new Date(dueDate.before) < new Date()) {
                throw new Error('invalid_dueDate');
            }
            if (new Date(dueDate.on) < new Date()) {
                throw new Error('invalid_dueDate');
            }
        }
        return true;
    }),
    (0, express_validator_1.check)('time')
        .optional()
        .isArray()
        .withMessage('must be an array')
        .custom(time => time.every((t) => Object.values(interfaces_1.TaskTime).includes(t)))
        .withMessage('Invalid task time, must be one of MORNING, MIDDAY, AFTERNOON, EVENING'),
    (0, express_validator_1.check)('title').optional().isString().withMessage('invalid_input').isLength({ max: 200, min: 5 }).withMessage('title_lenght'),
    (0, express_validator_1.check)('details').optional().isString().withMessage('invalid_input').isLength({ max: 8000, min: 10 }).withMessage('details_lenght'),
    (0, express_validator_1.check)('category').optional().isMongoId().withMessage('invalid_MongoId'),
    (0, express_validator_1.check)('location.online').optional().isBoolean().withMessage('invalid_input'),
    (0, express_validator_1.check)('location')
        .optional()
        .custom(location => {
        if (location.online)
            return true;
        if (location.coordinates)
            if (location.coordinates.length !== 2 ||
                typeof location.coordinates[0] !== 'number' ||
                typeof location.coordinates[1] !== 'number') {
                throw new Error('invalid_coordinates');
            }
        return true;
    }),
    (0, express_validator_1.check)('budget').optional().isNumeric().withMessage('invalid_input'),
    // ====================>>>>>>>> is empty <<<<<<<<<<<==================== //
    (0, express_validator_1.check)('offers').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('status').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('taskerId').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('acceptedOffer').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('paid').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('commission').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('commissionAfterDescount').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('paymentMethod').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('createdAt').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('updatedAt').isEmpty().withMessage('not_allowed'),
    validation_middleware_1.default,
];
