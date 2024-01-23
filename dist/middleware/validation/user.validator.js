"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidator = exports.deleteUserValidator = exports.getUserValidator = exports.updateLoggedUserValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_middleware_1 = __importDefault(require("../errors/validation.middleware"));
exports.updateLoggedUserValidator = [
    (0, express_validator_1.check)('name').optional().isString().withMessage('invalid_input'),
    (0, express_validator_1.check)('email').optional().isEmail().withMessage('invalid_email'),
    (0, express_validator_1.check)('password').isEmpty().withMessage('not_allowed'),
    // check('location')
    //   .optional()
    //   .isArray()
    //   .withMessage('Coordinates must be an array of numbers')
    //   // check if coordinates are valid numbers (longitude, latitude) [x, y]
    //   .custom(coordinates => {
    //     if (coordinates.length !== 2) {
    //       throw new Error('Coordinates must be an array of 2 numbers');
    //     }
    //     if (typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number') {
    //       throw new Error('Coordinates must be an array of 2 numbers');
    //     }
    //     return true;
    //   }),
    (0, express_validator_1.check)('role').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('active').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('createdAt').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('updatedAt').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('_id').isEmpty().withMessage('not_allowed'),
    validation_middleware_1.default,
];
exports.getUserValidator = [(0, express_validator_1.check)('id').notEmpty().withMessage('is_required').isMongoId().withMessage('invalid_MongoId'), validation_middleware_1.default];
exports.deleteUserValidator = [(0, express_validator_1.check)('id').notEmpty().withMessage('is_required').isMongoId().withMessage('invalid_MongoId'), validation_middleware_1.default];
exports.changePasswordValidator = [
    (0, express_validator_1.check)('oldPassword').notEmpty().withMessage('is_required'),
    // .custom((oldPassword, { req }) => req.body.newPassword !== oldPassword)
    // .withMessage('New password must be different from old password'),
    (0, express_validator_1.check)('newPassword').notEmpty().withMessage('is_required').isLength({ min: 8 }).withMessage('invalid_password'),
    validation_middleware_1.default,
];
