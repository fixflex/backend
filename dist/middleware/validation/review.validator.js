"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewValidator = exports.createReviewValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_middleware_1 = __importDefault(require("../errors/validation.middleware"));
exports.createReviewValidator = [
    // ====================>>>>>>>> is required <<<<<<<<<<<==================== //
    (0, express_validator_1.body)('taskId').notEmpty().withMessage('required').isMongoId().withMessage('invalid_MongoId'),
    (0, express_validator_1.body)('rating').isNumeric().withMessage('invalid_input').isFloat({ min: 0, max: 5 }).withMessage('invalid_rating'),
    (0, express_validator_1.body)('review').isString().withMessage('invalid_input').isLength({ max: 8000, min: 5 }).withMessage('review_lenght'),
    // ====================>>>>>>>> is empty <<<<<<<<<<<==================== //
    (0, express_validator_1.body)('userId').isEmpty().withMessage('not_allowed'),
    validation_middleware_1.default,
];
exports.updateReviewValidator = [
    // ====================>>>>>>>> is required <<<<<<<<<<<==================== //
    (0, express_validator_1.body)('id').isMongoId().withMessage('invalid_MongoId'),
    (0, express_validator_1.body)('rating').optional().isNumeric().withMessage('invalid_input').isFloat({ min: 0, max: 5 }).withMessage('invalid_rating'),
    (0, express_validator_1.body)('review').optional().isString().withMessage('invalid_input').isLength({ max: 8000, min: 5 }).withMessage('review_lenght'),
    // ====================>>>>>>>> is empty <<<<<<<<<<<==================== //
    (0, express_validator_1.body)('userId').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.body)('taskId').isEmpty().withMessage('not_allowed'),
    validation_middleware_1.default,
];
