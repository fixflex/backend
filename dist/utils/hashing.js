"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashCode = void 0;
// hash reset code
const crypto_1 = __importDefault(require("crypto"));
const hashCode = (code) => crypto_1.default.createHash('sha256').update(code).digest('hex');
exports.hashCode = hashCode;
