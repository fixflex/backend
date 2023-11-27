"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customResponse = void 0;
const customResponse = ({ data, success, error, message, status }) => {
    return {
        success,
        error,
        message,
        status,
        data,
    };
};
exports.customResponse = customResponse;
exports.default = exports.customResponse;
