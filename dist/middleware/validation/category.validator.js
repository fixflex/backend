"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategoryValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_middleware_1 = __importDefault(require("../errors/validation.middleware"));
exports.createCategoryValidator = [
    (0, express_validator_1.check)('name').notEmpty().withMessage('is_required').isString().withMessage('invalid_input').isLength({ max: 255 }).withMessage('exceeds_max_length'),
    validation_middleware_1.default,
];
