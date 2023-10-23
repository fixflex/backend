var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
import env from '../config/validateEnv';
import logger from '../utils/log';
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
const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose
        .connect(env.DB_URI)
        .then(conn => {
        logger.info(`Database Connected ✌️ ${conn.connection.host} `);
    })
        .catch(err => {
        logger.error(`Error: ${err.message}`);
        setTimeout(() => {
            process.exit(1);
        }, 100); // Delay the process
    });
});
export default dbConnection;
