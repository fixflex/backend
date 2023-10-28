"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const __1 = require("..");
const log_1 = __importDefault(require("../utils/log"));
// Graceful shutdown //
// Handle process kill signal
// Stop new requests from client
// Close all data process
// Exit from process
process.on('SIGINT', () => {
    log_1.default.error('👋 SIGINT RECEIVED. Shutting down gracefully');
    __1.server.close(() => {
        mongoose_1.default.connection
            .close()
            .then(() => {
            log_1.default.error('MongoDb connection closed.');
            log_1.default.error('💥 Process terminated!');
            process.exit(1);
        })
            .catch(err => {
            console.error('Error closing MongoDB connection:', err);
            process.exit(1);
        });
    });
});
process.on('unhandledRejection', (err) => {
    log_1.default.error(err.name, { message: err.message });
    log_1.default.error('UNHANDLED REJECTION! 💥 Shutting down...');
    __1.server.close(() => {
        process.exit(1);
    });
});
// uncaught exception  - synchronous errors
process.on('uncaughtException', (err) => {
    log_1.default.error(err.name, { message: err.message });
    log_1.default.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    process.exit(1);
});
