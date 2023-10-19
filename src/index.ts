import 'reflect-metadata';
import { container } from 'tsyringe';

import App from './app';
import { UserRoute } from './routes';
import { AuthRoute } from './routes';

let authRoute = container.resolve(AuthRoute);
let userRoute = container.resolve(UserRoute);

let app = new App([authRoute, userRoute]);

let server = app.listen();
let client = app.getServer();

export { server, client };
