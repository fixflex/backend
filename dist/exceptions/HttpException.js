"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @description   this class is responsible about operational error (errors that can be predicted)*/
class HttpException extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
    }
}
exports.default = HttpException;
