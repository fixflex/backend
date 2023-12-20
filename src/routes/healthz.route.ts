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
      // res.cookie('TestAccessToken', 'token', {
      //   httpOnly: true, // client side js cannot access the cookie
      //   maxAge: 24 * 60 * 60 * 1000, // one days
      //   secure: process.env.NODE_ENV === 'production', // cookie only works in https
      //   // privent cross-site access to the cookie (only allow same site access)
      //   sameSite: 'strict', // cross-site access not allowed
      // });
      res.cookie('accessToken', 'token', {
        httpOnly: true, // client side js cannot access the cookie
        maxAge: 24 * 60 * 60 * 1000, // one days
        secure: process.env.NODE_ENV === 'production', // cookie only works in https
        sameSite: 'lax', // cross-site access not allowed
      });
      res.status(200).json(customResponse({ data: null, success: true, status: 200, message: 'Welcome to Rest API - 👋🌎🌍🌏', error: false }));
    });
  }
}

export default HealthzRoute;
