"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const log_1 = __importDefault(require("../../utils/log"));
const handelCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value} `;
    return new HttpException_1.default(400, message);
};
const handelDuplicateFieldsDB = (err) => {
    let value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new HttpException_1.default(400, message);
};
const handelValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new HttpException_1.default(400, message);
};
const handleJwtInvalidSignture = () => new HttpException_1.default(401, 'Invalid token, please login again..');
const handleJwtExpired = () => new HttpException_1.default(401, 'Expired token, please login again..');
const sendForDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendForProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        // Programming or other unknown error: don't leak error details
    }
    else {
        // 1) Log error
        log_1.default.error('ERROR 💥', err);
        // 2) Send generic message
        res.status(500).json({ status: 'error', message: 'Something went wrong!' });
    }
};
const errorMiddleware = (err, _req, res, _next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Something went wrong';
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendForDev(err, res);
    }
    else {
        if (err.name === 'CastError') {
            err = handelCastErrorDB(err);
        }
        if (err.code === 11000) {
            err = handelDuplicateFieldsDB(err);
        }
        if (err.name === 'ValidationError') {
            err = handelValidationErrorDB(err);
        }
        if (err.name === 'JsonWebTokenError')
            err = handleJwtInvalidSignture();
        if (err.name === 'TokenEpiredError')
            err = handleJwtExpired();
        sendForProd(err, res);
    }
};
exports.errorMiddleware = errorMiddleware;
