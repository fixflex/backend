import { createServer } from 'http';
import 'reflect-metadata';
import { container } from 'tsyringe';

import App from './app';
import env from './config/validateEnv';
import { UserRoute } from './routes';
import { AuthRoute } from './routes';
import { ServiceRoute } from './routes';
import HealthzRoute from './routes/healthz.route';
import { TaskerRoute } from './routes/users/tasker.route';
import Socket from './sockets/socket';
import logger from './utils/log';

let authRoute = container.resolve(AuthRoute);
let userRoute = container.resolve(UserRoute);
let serviseRoute = container.resolve(ServiceRoute);
let taskerRoute = container.resolve(TaskerRoute);
let healthzRoute = container.resolve(HealthzRoute);

let app = new App([healthzRoute, authRoute, userRoute, taskerRoute, serviseRoute]);

// Setup http server
let client = app.getServer();
let server = createServer(client);

// Setup socket server
let socket = new Socket(server);
socket.initializeSocket();

server.listen(
  (env.PORT,
  () => {
    logger.info(`🚀 App listening in ${process.env.NODE_ENV} mode on the port ${env.PORT}`);
  })
);

export { server, client };
