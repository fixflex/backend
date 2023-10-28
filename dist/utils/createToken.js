"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateEnv_1 = __importDefault(require("../config/validateEnv"));
const createToken = (payload) => {
    const jwtSecret = validateEnv_1.default.JWT_SECRET_KEY;
    const jwtExpiration = validateEnv_1.default.JWT_EXPIRATION;
    return jsonwebtoken_1.default.sign({ userId: payload }, jwtSecret, { expiresIn: jwtExpiration });
};
exports.createToken = createToken;
