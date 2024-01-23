"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOfferValidator = exports.createOfferValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_middleware_1 = __importDefault(require("../errors/validation.middleware"));
exports.createOfferValidator = [
    (0, express_validator_1.check)('taskId').notEmpty().withMessage('is_required').isMongoId().withMessage('invalid_MongoId'),
    (0, express_validator_1.check)('message').notEmpty().withMessage('is_required').isString().withMessage('invalid_input').isLength({ max: 8000 }).withMessage('exceeds_max_length'),
    (0, express_validator_1.check)('subMessages').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('images').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('createdAt').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('updatedAt').isEmpty().withMessage('not_allowed'),
    validation_middleware_1.default,
];
exports.updateOfferValidator = [
    (0, express_validator_1.check)('taskId').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('taskerId').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('message').optional().isString().withMessage('invalid_input').isLength({ max: 8000 }).withMessage('exceeds_max_length'),
    (0, express_validator_1.check)('subMessages').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('images').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('createdAt').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('updatedAt').isEmpty().withMessage('not_allowed'),
    validation_middleware_1.default,
];
