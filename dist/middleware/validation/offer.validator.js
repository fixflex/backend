"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOfferValidator = exports.createOfferValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_middleware_1 = __importDefault(require("../errors/validation.middleware"));
exports.createOfferValidator = [
    // ====================>>>>>>>> is required <<<<<<<<<<<==================== //
    (0, express_validator_1.check)('taskId').notEmpty().withMessage('is_required').isMongoId().withMessage('invalid_MongoId'),
    // check the price is a number and min is 5
    (0, express_validator_1.check)('price')
        .notEmpty()
        .withMessage('is_required')
        .isNumeric()
        .withMessage('invalid_input')
        .isInt({ min: 10 })
        .withMessage('min_length'),
    (0, express_validator_1.check)('message').notEmpty().withMessage('is_required').isLength({ max: 8000 }).withMessage('exceeds_max_length'),
    // ====================>>>>>>>> is empty <<<<<<<<<<<==================== //
    (0, express_validator_1.check)('subMessages').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('status').isEmpty().withMessage('not_allowed'),
    // check('images').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('createdAt').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('updatedAt').isEmpty().withMessage('not_allowed'),
    validation_middleware_1.default,
];
exports.updateOfferValidator = [
    // ====================>>>>>>>> is required <<<<<<<<<<<==================== //
    (0, express_validator_1.check)('id').notEmpty().withMessage('is_required').isMongoId().withMessage('invalid_MongoId'),
    // ====================>>>>>>>> is optional <<<<<<<<<<<==================== //
    (0, express_validator_1.check)('price').optional().isNumeric().withMessage('invalid_input').isLength({ min: 5 }).withMessage('min_length'),
    (0, express_validator_1.check)('message').optional().isLength({ max: 8000 }).withMessage('exceeds_max_length'),
    // ====================>>>>>>>> is empty <<<<<<<<<<<==================== //
    (0, express_validator_1.check)('taskId').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('taskerId').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('status').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('subMessages').isEmpty().withMessage('not_allowed'),
    // check('images').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('createdAt').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('updatedAt').isEmpty().withMessage('not_allowed'),
    validation_middleware_1.default,
];
