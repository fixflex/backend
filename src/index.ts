import 'reflect-metadata';
import { container } from 'tsyringe';

import App from './app';
import { UserRoute } from './routes';
import { AuthRoute } from './routes';
import { ServiceRoute } from './routes';
import { TaskerRoute } from './routes/tasker.route';

let authRoute = container.resolve(AuthRoute);
let userRoute = container.resolve(UserRoute);
let serviseRoute = container.resolve(ServiceRoute);
let taskerRoute = container.resolve(TaskerRoute);

let app = new App([authRoute, userRoute, serviseRoute, taskerRoute]);

let server = app.listen();
let client = app.getServer();

export { server, client };
