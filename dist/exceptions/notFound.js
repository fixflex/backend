"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const HttpException_1 = __importDefault(require("./HttpException"));
const notFound = (req, _res, next) => {
    next(new HttpException_1.default(404, `Not found - ${req.originalUrl}`));
};
exports.notFound = notFound;
