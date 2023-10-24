"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devLogger = void 0;
const winston_1 = __importStar(require("winston"));
require("winston-mongodb");
const logFormat = winston_1.format.printf(info => {
    let message = `${info.timestamp} | ${info.level} | ${info.message}`;
    message = info.obj ? `${message} | data: ${JSON.stringify(info.obj)}` : message;
    return message;
});
const devLogger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm' }), logFormat),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: 'error.log', level: 'error', maxsize: 1048576 }),
        new winston_1.default.transports.File({ filename: 'combined.log', maxsize: 1048576, level: 'info' }), // 1MB
    ],
});
exports.devLogger = devLogger;
