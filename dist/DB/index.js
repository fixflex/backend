"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validateEnv_1 = __importDefault(require("../config/validateEnv"));
const log_1 = __importDefault(require("../helpers/log"));
// const options = {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   autoIndex: true,
//   poolSize: 10, // Maintain up to 10 socket connections. If not connected, return errors immediately rather than waiting for reconnect
//   bufferMaxEntries: 0,
//   connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
//   socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
// };
const dbConnection = async () => {
    mongoose_1.default
        .connect(validateEnv_1.default.DB_URI)
        .then(conn => {
        log_1.default.info(`Database Connected ✌️ ${conn.connection.host} `);
    })
        .catch(err => {
        log_1.default.error(`Error: ${err.message}`);
        setTimeout(() => {
            process.exit(1);
        }, 100); // Delay the process
    });
};
exports.default = dbConnection;
