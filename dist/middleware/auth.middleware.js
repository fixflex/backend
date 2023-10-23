var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import UserModel from '../DB/models/user/user.model';
import env from '../config/validateEnv';
import HttpException from '../exceptions/HttpException';
const checkTokenExists = (req, next) => {
    var _a;
    if (!((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith('Bearer'))) {
        return next(new HttpException(401, `You are not authorized, you must login to get access this route`));
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return next(new HttpException(401, `You are not authorized, you must login to get access this route`));
    }
    return token;
};
const checkUserExists = (userId, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModel.findById(userId);
    if (!user) {
        return next(new HttpException(401, 'The user that belongs to this token no longer exists'));
    }
    return user;
});
const authenticateUser = asyncHandler((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = checkTokenExists(req, next);
    const decoded = jwt.verify(token, env.JWT_SECRET_KEY);
    const user = yield checkUserExists(decoded.userId, next);
    req.user = user;
    next();
}));
// Authorization (User permissions)
const allowedTo = (...roles) => (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new HttpException(403, `You are not allowed to perform this action`));
    }
    next();
};
export { authenticateUser, allowedTo };
