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

const dbConnection = async () => {
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
};

export default dbConnection;
