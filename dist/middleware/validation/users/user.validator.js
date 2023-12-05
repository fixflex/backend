"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidator = exports.deleteUserValidator = exports.getUserValidator = exports.updateLoggedUserValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_middleware_1 = __importDefault(require("../../errors/validation.middleware"));
exports.updateLoggedUserValidator = [
    (0, express_validator_1.check)('name').optional().isString().withMessage('Name must be a string'),
    (0, express_validator_1.check)('email').optional().isEmail().withMessage('invalid email address'),
    (0, express_validator_1.check)('password').isEmpty().withMessage('Cannot change password from here'),
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
    (0, express_validator_1.check)('role').isEmpty().withMessage('Role is not allowed'),
    (0, express_validator_1.check)('active').isEmpty().withMessage('Active is not allowed'),
    (0, express_validator_1.check)('createdAt').isEmpty().withMessage('createdAt is not allowed'),
    (0, express_validator_1.check)('updatedAt').isEmpty().withMessage('updatedAt is not allowed'),
    (0, express_validator_1.check)('_id').isEmpty().withMessage('_id is not allowed'),
    validation_middleware_1.default,
];
exports.getUserValidator = [(0, express_validator_1.check)('id').notEmpty().withMessage('User id is required').isMongoId().withMessage('Invalid user id format '), validation_middleware_1.default];
exports.deleteUserValidator = [(0, express_validator_1.check)('id').notEmpty().withMessage('User id is required').isMongoId().withMessage('Invalid user id format '), validation_middleware_1.default];
exports.changePasswordValidator = [
    (0, express_validator_1.check)('oldPassword')
        .notEmpty()
        .withMessage('Old password is required')
        .custom((oldPassword, { req }) => req.body.newPassword !== oldPassword)
        .withMessage('New password must be different from old password'),
    (0, express_validator_1.check)('newPassword').notEmpty().withMessage('User newPassword is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    validation_middleware_1.default,
];
// ===================  =====================
// export const updateUserValidator = [
//   check('id')
//     .notEmpty()
//     .withMessage('User id is required')
//     .isMongoId()
//     .withMessage('Invalid user id format '),
//   check('name').optional().isString().withMessage('Name must be a string'),
//   check('email').optional().isEmail().withMessage('invalid email address'),
//   check('password')
//     .optional()
//     .isLength({ min: 8 })
//     .withMessage('Password must be at least 8 characters'),
//   check('confirmPassword')
//     .optional()
//     .custom((confirmPassword, { req }) => {
//       if (confirmPassword !== req.body.password) {
//         throw new Error('Passwords must match');
//       }
//       return true;
//     }),
//   validatorMiddleware,
// ];
// port const createUserValidator = [
//   check('firstName')
//     .notEmpty()
//     .withMessage('firstName is required')
//     .isString()
//     .withMessage('Name must be a string'),
//   check('lastName')
//     .notEmpty()
//     .withMessage('lastName is required')
//     .isString()
//     .withMessage('Name must be a string'),
//   check('email')
//     .notEmpty()
//     .withMessage('User email is required')
//     .isEmail()
//     .withMessage('Email is invalid'),
//   check('password')
//     .notEmpty()
//     .withMessage('User password is required')
//     .isLength({ min: 8 })
//     .withMessage('Password must be at least 8 characters'),
//   check('confirmPassword')
//     .notEmpty()
//     .withMessage('Confirm password is required')
//     .custom((confirmPassword, { req }) => {
//       if (confirmPassword !== req.body.password) {
//         throw new Error('Passwords must match');
//       } else {
//         return true;
//       }
//     }),
//   validatorMiddleware,
// ];
