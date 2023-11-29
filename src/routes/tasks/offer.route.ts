import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { OfferController } from '../../controllers/tasks/offer.controller';
import { Routes } from '../../interfaces';

@autoInjectable()
class OfferRoute implements Routes {
  public path = '/offers';
  public router = Router();
  constructor(private readonly offerController: OfferController) {
    this.initializerRoutes();
  }
  private initializerRoutes() {}
}

export { OfferRoute };
