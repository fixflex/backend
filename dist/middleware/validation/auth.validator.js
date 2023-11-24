"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.signupValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_middleware_1 = __importDefault(require("../errors/validation.middleware"));
exports.signupValidator = [
    (0, express_validator_1.check)('firstName').notEmpty().withMessage('firstName is required').isString().withMessage('Name must be a string'),
    (0, express_validator_1.check)('lastName').notEmpty().withMessage('lastName is required').isString().withMessage('Name must be a string'),
    (0, express_validator_1.check)('email').notEmpty().withMessage('User email is required').isEmail().withMessage('Email is invalid'),
    (0, express_validator_1.check)('password').notEmpty().withMessage('User password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    (0, express_validator_1.check)('role').isEmpty().withMessage('Role is not allowed'),
    (0, express_validator_1.check)('active').isEmpty().withMessage('Active is not allowed'),
    validation_middleware_1.default,
];
exports.loginValidator = [
    (0, express_validator_1.check)('email').notEmpty().withMessage('User email is required').isEmail().withMessage('Email is invalid'),
    (0, express_validator_1.check)('password').notEmpty().withMessage('User password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    validation_middleware_1.default,
];
