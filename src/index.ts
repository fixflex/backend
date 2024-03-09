import { createServer } from 'http';

import app from './app';
import env from './config/validateEnv';
import logger from './helpers/log';
import { SocketService } from './sockets/socket';

// Setup http server
// let client = app;
app;
let server = createServer();

// let whatsappclient = app.whatsappclient;
let s = server.listen(env.PORT).on('listening', () => {
  logger.info(`🚀 App listening in ${env.NODE_ENV} mode on the port ${env.PORT}`);
});

// Setup socket server
let socketService = SocketService.getInstance(s);
let io = socketService.getSocketIO();
export { server, io };

//  create
