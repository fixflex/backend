import mongoose from 'mongoose';

import { server } from '..';
import logger from '../utils/log';

// Graceful shutdown //

// Handle process kill signal
// Stop new requests from client
// Close all data process
// Exit from process

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

process.on('unhandledRejection', (err: Error) => {
  logger.error(err.name, { message: err.message });
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
// uncaught exception  - synchronous errors
process.on('uncaughtException', (err: Error) => {
  logger.error(err.name, { message: err.message });
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  process.exit(1);
});
