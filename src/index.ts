import App from './app';
import { UserRoute } from './routes';
import { AuthRoute } from './routes';

let app = new App([new UserRoute(), new AuthRoute()]);

let server = app.listen();
let client = app.getServer();

export { server, client };

