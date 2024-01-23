"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.signupValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_middleware_1 = __importDefault(require("../errors/validation.middleware"));
exports.signupValidator = [
    (0, express_validator_1.check)('firstName').notEmpty().withMessage('is_required').isString().withMessage('invalid_input'),
    (0, express_validator_1.check)('lastName').notEmpty().withMessage('is_required').isString().withMessage('invalid_input'),
    (0, express_validator_1.check)('email').notEmpty().withMessage('is_required').isEmail().withMessage('invalid_email'),
    (0, express_validator_1.check)('password').notEmpty().withMessage('is_required').isLength({ min: 8 }).withMessage('invalid_password'),
    (0, express_validator_1.check)('role').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('active').isEmpty().withMessage('not_allowed'),
    validation_middleware_1.default,
];
exports.loginValidator = [
    (0, express_validator_1.check)('email').notEmpty().withMessage('is_required').isEmail().withMessage('invalid_email'),
    (0, express_validator_1.check)('password').notEmpty().withMessage('is_required').isLength({ min: 8 }).withMessage('invalid_password'),
    validation_middleware_1.default,
];
