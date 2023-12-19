import { Router } from 'express';
import { Request, Response } from 'express';

import { Routes } from '../interfaces/routes.interface';
import customResponse from '../utils/customResponse';

class HealthzRoute implements Routes {
  public path = '/healthz';
  public router = Router();

  constructor() {
    this.initializerRoutes();
  }
  private initializerRoutes() {
    this.router.get(`${this.path}`, (_req: Request, res: Response) => {
      res.status(200).json(customResponse({ data: null, success: true, status: 200, message: 'Welcome to Rest API - 👋🌎🌍🌏', error: false }));
    });

    this.router.get('/', (_req: Request, res: Response) => {
      // log request cookies
      // console.log('Cookies: ', _req.cookies);
      res.status(200).json(customResponse({ data: null, success: true, status: 200, message: 'Welcome to Rest API - 👋🌎🌍🌏', error: false }));
    });
  }
}

export default HealthzRoute;
