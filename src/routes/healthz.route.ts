import { Router } from 'express';
import { Request, Response } from 'express';

import customResponse from '../helpers/customResponse';
import { Routes } from '../interfaces/routes.interface';

class HealthzRoute implements Routes {
  public path = '/healthz';
  public router = Router();

  constructor() {
    this.initializerRoutes();
  }
  private initializerRoutes() {
    this.router.get('/', (_req: Request, res: Response) => {
      res.status(200).json(customResponse({ data: null, success: true, message: 'Welcome to Rest API - 👋🌎🌍🌏' }));
    });

    this.router.get(`${this.path}`, (_req: Request, res: Response) => {
      res.status(200).json(customResponse({ data: null, success: true, message: 'Welcome to Rest API - 👋🌎🌍🌏' }));
    });
  }
}

export default HealthzRoute;

//   // res.status(200).json(customResponse({ data: null, success: true, message: req.t('healthz') }));
//   // try sse (server sent events) to send the response to the client every 5 seconds, the response is the time now
//   res.setHeader('Content-Type', 'text/event-stream'); // set the content type to text/event-stream to enable sse in the client side (browser), if the content type is not set to text/event-stream like application/json the client will not receive the response every 5 seconds
//   res.setHeader('Cache-Control', 'no-cache'); // disable caching the response in the client side , why ? because we want to send the response every 5 seconds and if the response is cached the client will not receive the new response if the you don't disable the caching of the response in the client side then the client will receive the response only one time and will not receive the new response every 5 seconds
//   res.setHeader('Connection', 'keep-alive'); // keep the connection alive to send the response every 5 seconds if the client is still connected to the server but if the client is disconnected the server will close the connection
//   // res.flushHeaders(); // flush the headers to the client to start the connection, this means that the server will send the response to the client every 5 seconds if the client is still connected to the server, if the client is disconnected the server will close the connection, if you don't flush the headers the server will not send the response to the client every 5 seconds
//   res.write('data: ' + new Date().toLocaleTimeString() + '\n\n');
//   const interval = setInterval(() => {
//     res.write('data: ' + new Date().toLocaleTimeString() + '\n\n');
//   }, 1000);
//   res.on('close', () => {
//     console.log('client dropped me');
//     clearInterval(interval);
//   });
// });
// the privous code is for sse (server sent events) to send the response to the client every 5 seconds, the response is the time now