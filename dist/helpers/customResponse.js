"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customResponse = void 0;
const customResponse = ({ data, success, message, pagination, results }) => {
    return {
        results,
        pagination,
        success,
        message,
        data,
    };
};
exports.customResponse = customResponse;
exports.default = exports.customResponse;
