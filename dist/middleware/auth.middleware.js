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
const checkAccessTokenExists = (req) => {
    // check cookies first then check headers for the token (for the swagger docs)
    let token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];
    if (!token || token === 'null') {
        return;
    }
    console.log(token);
    return token;
};
const checkUserExists = async (userId) => {
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        return;
    }
    return user;
};
const isPasswordChanged = (passwordChangedAt, tokenIssuedAt) => {
    if (passwordChangedAt) {
        const changedAt = passwordChangedAt.getTime() / 1000;
        if (changedAt > tokenIssuedAt) {
            return true;
        }
    }
    return false;
};
const authenticateUser = (0, express_async_handler_1.default)(async (req, _res, next) => {
    // 1- check if the token exists
    const token = checkAccessTokenExists(req);
    if (!token) {
        return next(new HttpException_1.default(401, `You are not authorized, you must login to get access this route`));
    }
    // 2- check if the token is valid
    const decoded = jsonwebtoken_1.default.verify(token, validateEnv_1.default.ACCESS_TOKEN_SECRET_KEY);
    // 3- check if the user still exists
    const user = await checkUserExists(decoded.userId);
    if (!user) {
        return next(new HttpException_1.default(401, 'The user that belongs to this token no longer exists'));
    }
    // 4- check if the user changed his password after the token was issued
    // TODO: make this check in the user model instead of here
    if (isPasswordChanged(user.passwordChangedAt, decoded.iat)) {
        // iat is the time the token was issued
        return next(new HttpException_1.default(401, 'User recently changed password! Please log in again'));
    }
    //  // 5- check if the user is active
    if (!user.active) {
        return next(new HttpException_1.default(401, 'This user is no longer active'));
    }
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
