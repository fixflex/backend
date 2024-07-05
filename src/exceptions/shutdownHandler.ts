import mongoose from 'mongoose';

import { server } from '..';
import env from '../config/validateEnv';
import { sendMailer } from '../helpers';
import logger from '../helpers/log';

// Graceful shutdown //

//1) Handle process kill signal
//2) Stop new requests from client
//3) Close all data process
//4) Exit from process

process.on('SIGINT', () => {
  logger.error('👋 SIGINT RECEIVED. Shutting down gracefully');
  server.close(() => {
    mongoose.connection
      .close()
      .then(() => {
        logger.error('MongoDb connection closed.');
        logger.error('💥 Process terminated!');
        process.exit(1);
      })
      .catch(err => {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      });
  });
});

// 1- unhandled rejection - asynchronous errors
process.on('unhandledRejection', async (err: Error) => {
  logger.error(err.name, { message: err.message });
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log('error name', err.name, 'error message', err.message);
  // this will cause the server to stop listening to new requests but it will not close the process
  // use process.exit(1) to exit from the process

  // server.close(() => {
  //   process.exit(1);
  // });

  // send email to the developer to notify him about the error .
  if (env.NODE_ENV === 'production') {
    const message = `Unhandled Rejection! \nError name: ${err.name} \nError message: ${err.message} \nError stack: ${err.stack}`;
    await sendMailer(env.DEVELOPER_EMAIL, 'Unhandled Rejection', message);
  }
  process.exit(1); // 0 success 1 failure
});

// 2- uncaught exception  - synchronous errors
process.on('uncaughtException', (err: Error) => {
  logger.error(err.name, { message: err.message });
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  // send email to the developer to notify him about the error .
  if (env.NODE_ENV === 'production') {
    const message = `Uncaught Exception! \nError name: ${err.name} \nError message: ${err.message} \nError stack: ${err.stack}`;
    sendMailer(env.DEVELOPER_EMAIL, 'Uncaught Exception', message);
  }
  process.exit(1);
});
