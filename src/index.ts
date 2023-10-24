import 'reflect-metadata';
import { container } from 'tsyringe';

import App from './app';
import { UserRoute } from './routes';
import { AuthRoute } from './routes';
import { ServiceRoute } from './routes';
import HealthzRoute from './routes/healthz.route';
import { TaskerRoute } from './routes/users/tasker.route';

let authRoute = container.resolve(AuthRoute);
let userRoute = container.resolve(UserRoute);
let serviseRoute = container.resolve(ServiceRoute);
let taskerRoute = container.resolve(TaskerRoute);
let healthzRoute = container.resolve(HealthzRoute);

let app = new App([healthzRoute, authRoute, userRoute, taskerRoute, serviseRoute]);

let server = app.listen();
let client = app.getServer();

export { server, client };
