"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCouponValidator = void 0;
const express_validator_1 = require("express-validator");
const interfaces_1 = require("../../interfaces");
const validation_middleware_1 = __importDefault(require("../errors/validation.middleware"));
exports.createCouponValidator = [
    (0, express_validator_1.check)('code').notEmpty().withMessage('code is required').isString().withMessage('code must be a string'),
    (0, express_validator_1.check)('type').optional().isIn(Object.values(interfaces_1.CouponType)).withMessage('invalid coupon type'),
    (0, express_validator_1.check)('value')
        .notEmpty()
        .withMessage('value is required')
        .isNumeric()
        .withMessage('value must be a number')
        .custom(value => {
        if (value < 0) {
            throw new Error('value must be positive');
        }
        return true;
    }),
    (0, express_validator_1.check)('maxUses', 'maxUses is required')
        .notEmpty()
        .isNumeric()
        .withMessage('maxUses must be a number')
        .custom(maxUses => {
        if (maxUses < 0) {
            throw new Error('maxUses must be positive');
        }
        return true;
    }),
    validation_middleware_1.default,
];
