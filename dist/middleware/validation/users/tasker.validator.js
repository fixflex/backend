"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskerValidator = exports.createTaskerValidator = exports.getTaskersValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_middleware_1 = __importDefault(require("../../errors/validation.middleware"));
exports.getTaskersValidator = [
    (0, express_validator_1.check)('longitude').optional().isNumeric().withMessage('Longitude must be a number'),
    (0, express_validator_1.check)('latitude').optional().isNumeric().withMessage('Latitude must be a number'),
    (0, express_validator_1.check)('services').optional().isMongoId().withMessage('Service must be a valid mongo ID'),
    validation_middleware_1.default,
];
exports.createTaskerValidator = [
    (0, express_validator_1.check)('services').isArray().withMessage('Services must be an array').isLength({ min: 1 }).withMessage('Services must have at least one service'),
    (0, express_validator_1.check)('services.*').isMongoId().withMessage('Service must be a valid mongo ID'),
    //         "location": {
    // "coordinates": [32.1617485, 26.0524745]
    // }
    // custom validator to check if coordinates are valid numbers (longitude, latitude) [x, y]
    (0, express_validator_1.check)('location')
        .notEmpty()
        .withMessage('Location is required')
        .custom(location => {
        if (location.coordinates.length !== 2) {
            throw new Error('location.Coordinates must be an array of 2 numbers');
        }
        if (typeof location.coordinates[0] !== 'number' || typeof location.coordinates[1] !== 'number') {
            throw new Error('Coordinates must be an array of 2 numbers');
        }
        return true;
    }),
    //  ckeck that the phone number is valid  and be from egypt
    (0, express_validator_1.check)('phoneNumber').notEmpty().withMessage('Phone number is required').isMobilePhone('ar-EG').withMessage('Invalid phone number'),
    // https://www.npmjs.com/package/google-libphonenumber
    (0, express_validator_1.check)('rating').isEmpty().withMessage('Rating is not allowed'),
    (0, express_validator_1.check)('completedTasks').isEmpty().withMessage('Completed tasks is not allowed'),
    validation_middleware_1.default,
];
exports.updateTaskerValidator = [
    (0, express_validator_1.check)('services').isEmpty().withMessage('Services is not allowed to be updated in this route'),
    // check('services').optional().isArray().withMessage('Services must be an array').isLength({ min: 1 }).withMessage('Services must have at least one service'),
    // check('services.*').optional().isMongoId().withMessage('Service must be a valid mongo ID'),
    (0, express_validator_1.check)('bio').optional().isString().withMessage('Bio must be a string'),
    (0, express_validator_1.check)('rating').isEmpty().withMessage('Rating is not allowed'),
    (0, express_validator_1.check)('completedTasks').isEmpty().withMessage('Completed tasks is not allowed'),
    (0, express_validator_1.check)('phoneNumber').optional().isMobilePhone('ar-EG').withMessage('Invalid phone number'),
    validation_middleware_1.default,
];
