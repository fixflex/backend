import { createServer } from 'http';

import { App } from './app';
import env from './config/validateEnv';
import logger from './helpers/log';
import { SocketService } from './sockets/socket';

// Setup app
let app = new App();

// Setup http server
let client = app.getServer();
let server = createServer(client);

let s = server.listen(env.PORT).on('listening', () => {
  logger.info(`🚀 App listening in ${env.NODE_ENV} mode on the port ${env.PORT}`);
});

// Setup socket server
let socketService = SocketService.getInstance(s);
let io = socketService.getSocketIO();

export { server, io, client, app };
