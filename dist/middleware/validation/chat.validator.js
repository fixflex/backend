"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChatValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_middleware_1 = __importDefault(require("../errors/validation.middleware"));
exports.createChatValidator = [
    (0, express_validator_1.check)('tasker').isMongoId().withMessage('invalid_MongoId'),
    // ====================>>>>>>>> is empty <<<<<<<<<<<==================== //
    (0, express_validator_1.check)('_id').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('messages').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('user').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('createdAt').isEmpty().withMessage('not_allowed'),
    (0, express_validator_1.check)('updatedAt').isEmpty().withMessage('not_allowed'),
    validation_middleware_1.default,
];
