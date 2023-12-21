"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateEnv_1 = __importDefault(require("../config/validateEnv"));
const createAccessToken = (payload) => {
    const jwtSecret = validateEnv_1.default.ACCESS_TOKEN_SECRET_KEY;
    const jwtExpiration = validateEnv_1.default.ACCESS_TOKEN_KEY_EXPIRE_TIME;
    return jsonwebtoken_1.default.sign({ userId: payload }, jwtSecret, { expiresIn: jwtExpiration });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (payload) => {
    const jwtSecret = validateEnv_1.default.REFRESH_TOKEN_SECRET_KEY;
    const jwtExpiration = validateEnv_1.default.REFRESH_TOKEN_KEY_EXPIRE_TIME;
    return jsonwebtoken_1.default.sign({ userId: payload }, jwtSecret, { expiresIn: jwtExpiration });
};
exports.createRefreshToken = createRefreshToken;
