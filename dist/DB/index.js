"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
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
// TODO: Add options to the connection
// TODO: Create a connection pool
// TODO: Add a connection pool to the connection
// TODO: Convert the dbConnection function to a class and add a method to close the connection pool
// TODO: Make the connection pool a singleton class to avoid multiple connections to the database and to avoid memory leaks from the connection, and to avoid the overhead of creating a new connection pool
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
exports.dbConnection = dbConnection;
