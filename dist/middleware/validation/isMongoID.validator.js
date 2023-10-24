"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMongoId = void 0;
// is mongodb id validator
const express_validator_1 = require("express-validator");
const validation_middleware_1 = __importDefault(require("../errors/validation.middleware"));
exports.isMongoId = [(0, express_validator_1.check)('id').notEmpty().withMessage('id is required').isMongoId().withMessage('Invalid id format '), validation_middleware_1.default];
