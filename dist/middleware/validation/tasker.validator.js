"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskerValidator = exports.createTaskerValidator = exports.getTaskersValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_middleware_1 = __importDefault(require("../errors/validation.middleware"));
exports.getTaskersValidator = [
    (0, express_validator_1.check)('longitude').optional().isNumeric().withMessage('this_field_must_be_a_number'),
    (0, express_validator_1.check)('latitude').optional().isNumeric().withMessage('this_field_must_be_a_number'),
    (0, express_validator_1.check)('categories').optional().isMongoId().withMessage('invalid_MongoId'),
    validation_middleware_1.default,
];
exports.createTaskerValidator = [
    (0, express_validator_1.check)('categories').isArray().withMessage('this_field_must_be_an_array').isLength({ min: 1 }).withMessage('this_field_is_required'),
    (0, express_validator_1.check)('categories.*').isMongoId().withMessage('invalid_MongoId'),
    //         "location": {
    // "coordinates": [32.1617485, 26.0524745]
    // }
    // custom validator to check if coordinates are valid numbers (longitude, latitude) [x, y]
    (0, express_validator_1.check)('location')
        .notEmpty()
        .withMessage('this_field_is_required')
        .custom(location => {
        if (location.coordinates.length !== 2) {
            throw new Error('invalid_coordinates');
        }
        if (typeof location.coordinates[0] !== 'number' || typeof location.coordinates[1] !== 'number') {
            throw new Error('invalid_coordinates');
        }
        return true;
    }),
    //  ckeck that the phone number is valid  and be from egypt
    (0, express_validator_1.check)('phoneNumber').notEmpty().withMessage('this_field_is_required').isMobilePhone('ar-EG').withMessage('invalid_phone_number'),
    // https://www.npmjs.com/package/google-libphonenumber
    (0, express_validator_1.check)('rating').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('completedTasks').isEmpty().withMessage('not_allowed'),
    validation_middleware_1.default,
];
exports.updateTaskerValidator = [
    (0, express_validator_1.check)('categories').isEmpty().withMessage('not_allowed'),
    // check('categories').optional().isArray().withMessage('Services must be an array').isLength({ min: 1 }).withMessage('Services must have at least one service'),
    // check('categories.*').optional().isMongoId().withMessage('Service must be a valid mongo ID'),
    (0, express_validator_1.check)('bio').optional().isString().withMessage('invalid_input').isLength({ max: 8000 }).withMessage('this_field_must_be_less_than_8000_characters'),
    (0, express_validator_1.check)('rating').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('completedTasks').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('phoneNumber').optional().isMobilePhone('ar-EG').withMessage('invalid_phone_number'),
    validation_middleware_1.default,
];
