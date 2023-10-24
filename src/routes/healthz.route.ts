import { Router } from 'express';
import { Request, Response } from 'express';

import { Routes } from '../interfaces/routes.interface';

class HealthzRoute implements Routes {
  public path = '/healthz';
  public router = Router();

  constructor() {
    this.initializerRoutes();
  }
  private initializerRoutes() {
    this.router.get(`${this.path}`, (_req: Request, res: Response) => {
      res.status(200).send('OK');
    });

    this.router.get('/', (_req: Request, res: Response) => {
      res.status(200).send('OK');
    });
  }
}

export default HealthzRoute;
