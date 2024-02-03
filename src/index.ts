import { createServer } from 'http';
import 'reflect-metadata';
import { container } from 'tsyringe';

import App from './app';
import env from './config/validateEnv';
import logger from './helpers/log';
import { UserRoute } from './routes';
import { AuthRoute } from './routes';
import { CategoryRoute } from './routes';
import { ChatRoute } from './routes/chat.route';
import { CouponRoute } from './routes/coupon.route';
import HealthzRoute from './routes/healthz.route';
import { OfferRoute } from './routes/offer.route';
import { TaskRoute } from './routes/task.route';
import { TaskerRoute } from './routes/tasker.route';
import Socket from './sockets/socket';

// Setup routes
let authRoute = container.resolve(AuthRoute);
let userRoute = container.resolve(UserRoute);
let categoryRoute = container.resolve(CategoryRoute);
let taskerRoute = container.resolve(TaskerRoute);
let healthzRoute = container.resolve(HealthzRoute);
let chatRoute = container.resolve(ChatRoute);
let taskRoute = container.resolve(TaskRoute);
let offerRoute = container.resolve(OfferRoute);
let couponRoute = container.resolve(CouponRoute);
// Setup app
let app = new App([healthzRoute, authRoute, userRoute, taskerRoute, categoryRoute, chatRoute, taskRoute, offerRoute, couponRoute]);

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
