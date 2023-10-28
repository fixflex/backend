"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedTo = exports.authenticateUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../DB/models/user/user.model"));
const validateEnv_1 = __importDefault(require("../config/validateEnv"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const checkTokenExists = (req, next) => {
    if (!req.headers.authorization?.startsWith('Bearer')) {
        return next(new HttpException_1.default(401, `You are not authorized, you must login to get access this route`));
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return next(new HttpException_1.default(401, `You are not authorized, you must login to get access this route`));
    }
    return token;
};
const checkUserExists = async (userId, next) => {
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        return next(new HttpException_1.default(401, 'The user that belongs to this token no longer exists'));
    }
    return user;
};
const authenticateUser = (0, express_async_handler_1.default)(async (req, _res, next) => {
    const token = checkTokenExists(req, next);
    const decoded = jsonwebtoken_1.default.verify(token, validateEnv_1.default.JWT_SECRET_KEY);
    const user = await checkUserExists(decoded.userId, next);
    req.user = user;
    next();
});
exports.authenticateUser = authenticateUser;
// Authorization (User permissions)
const allowedTo = (...roles) => (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new HttpException_1.default(403, `You are not allowed to perform this action`));
    }
    next();
};
exports.allowedTo = allowedTo;
