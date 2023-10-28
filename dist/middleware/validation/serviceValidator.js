"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_middleware_1 = __importDefault(require("../errors/validation.middleware"));
exports.createServiceValidator = [
    (0, express_validator_1.check)('name').notEmpty().withMessage('Service name is required').isString().withMessage('Service name must be a string'),
    validation_middleware_1.default,
];
