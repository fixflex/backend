"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const __1 = require("..");
const validateEnv_1 = __importDefault(require("../config/validateEnv"));
const helpers_1 = require("../helpers");
const log_1 = __importDefault(require("../helpers/log"));
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
// 1- unhandled rejection - asynchronous errors
process.on('unhandledRejection', async (err) => {
    log_1.default.error(err.name, { message: err.message });
    log_1.default.error('UNHANDLED REJECTION! 💥 Shutting down...');
    // this will cause the server to stop listening to new requests but it will not close the process
    // and the process will still running in the background
    // and this is not what we want so we will use process.exit(1) to exit from the process
    // and stop it from running in the background  and this will cause the process to stop and the server to stop listening to new requests but the server will respond to the requests that are already running
    // and close all data process and exit from the process  .
    // server.close(() => {
    //   process.exit(1);
    // });
    // send email to the developer to notify him about the error .
    if (validateEnv_1.default.NODE_ENV === 'production') {
        const message = `Unhandled Rejection! \nError name: ${err.name} \nError message: ${err.message} \nError stack: ${err.stack}`;
        await (0, helpers_1.sendMailer)(validateEnv_1.default.DEVELOPER_EMAIL, 'Unhandled Rejection', message);
    }
    // if you want to close the process without waiting for the server to finish the requests that are already running you can use this code instead of the above code .
    process.exit(1); // 0 success 1 failure . // Note if there is any request that is already running it will not be finished and the process will be closed immediately if you want to wait for the requests to finish you can use the above code .
});
// 2- uncaught exception  - synchronous errors
process.on('uncaughtException', (err) => {
    log_1.default.error(err.name, { message: err.message });
    log_1.default.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    // send email to the developer to notify him about the error .
    if (validateEnv_1.default.NODE_ENV === 'production') {
        const message = `Uncaught Exception! \nError name: ${err.name} \nError message: ${err.message} \nError stack: ${err.stack}`;
        (0, helpers_1.sendMailer)(validateEnv_1.default.DEVELOPER_EMAIL, 'Uncaught Exception', message);
    }
    process.exit(1);
});
