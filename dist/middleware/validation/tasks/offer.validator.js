"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOfferValidator = exports.createOfferValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_middleware_1 = __importDefault(require("../../errors/validation.middleware"));
exports.createOfferValidator = [
    (0, express_validator_1.check)('taskId').notEmpty().withMessage('Task ID is required').isMongoId().withMessage('Task ID must be a valid mongo ID'),
    (0, express_validator_1.check)('message')
        .notEmpty()
        .withMessage('Message is required')
        .isString()
        .withMessage('Message must be a string')
        .isLength({ max: 8000 })
        .withMessage('Message must be less than 6000 characters'),
    (0, express_validator_1.check)('subMessages').isEmpty().withMessage('Sub messages is not allowed to be updated in this route'),
    (0, express_validator_1.check)('images').isEmpty().withMessage('Images is not allowed to be updated in this route'),
    (0, express_validator_1.check)('createdAt').isEmpty().withMessage('createdAt is not allowed to be updated in this route'),
    (0, express_validator_1.check)('updatedAt').isEmpty().withMessage('updatedAt is not allowed to be updated in this route'),
    validation_middleware_1.default,
];
exports.updateOfferValidator = [
    (0, express_validator_1.check)('taskId').isEmpty().withMessage('Task ID is not allowed to be updated in this route'),
    (0, express_validator_1.check)('taskerId').isEmpty().withMessage('Tasker ID is not allowed to be updated in this route'),
    (0, express_validator_1.check)('message').optional().isString().withMessage('Message must be a string').isLength({ max: 8000 }).withMessage('Message must be less than 6000 characters'),
    (0, express_validator_1.check)('subMessages').isEmpty().withMessage('Sub messages is not allowed to be updated in this route'),
    (0, express_validator_1.check)('images').isEmpty().withMessage('Images is not allowed to be updated in this route'),
    (0, express_validator_1.check)('createdAt').isEmpty().withMessage('createdAt is not allowed to be updated in this route'),
    (0, express_validator_1.check)('updatedAt').isEmpty().withMessage('updatedAt is not allowed to be updated in this route'),
    validation_middleware_1.default,
];
