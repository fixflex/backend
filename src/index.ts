import { createServer } from 'http';
import 'reflect-metadata';
import { container } from 'tsyringe';

import App from './app';
import env from './config/validateEnv';
import { UserRoute } from './routes';
import { AuthRoute } from './routes';
import { ServiceRoute } from './routes';
import { ChatRoute } from './routes/chat.route';
import HealthzRoute from './routes/healthz.route';
import { TaskRoute } from './routes/tasks/task.route';
import { TaskerRoute } from './routes/users/tasker.route';
import Socket from './sockets/socket';
import logger from './utils/log';

// Setup routes
let authRoute = container.resolve(AuthRoute);
let userRoute = container.resolve(UserRoute);
let serviseRoute = container.resolve(ServiceRoute);
let taskerRoute = container.resolve(TaskerRoute);
let healthzRoute = container.resolve(HealthzRoute);
let chatRoute = container.resolve(ChatRoute);
let taskRoute = container.resolve(TaskRoute);

// Setup app
let app = new App([healthzRoute, authRoute, userRoute, taskerRoute, serviseRoute, chatRoute, taskRoute]);

// Setup http server
let client = app.getServer();
let server = createServer(client);

// Setup socket server
let socket = new Socket(server);
socket.initializeSocket();

server.listen(env.PORT).on('listening', () => {
  logger.info(`🚀 App listening in ${env.NODE_ENV} mode on the port ${env.PORT}`);
});

export { server, client };
