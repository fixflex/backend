import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { OfferController } from '../controllers/offer.controller';
import { Routes } from '../interfaces';
import { authenticateUser } from '../middleware/auth.middleware';
import { isMongoId } from '../middleware/validation/isMongoID.validator';
import { createOfferValidator, updateOfferValidator } from '../middleware/validation/offer.validator';

@autoInjectable()
class OfferRoute implements Routes {
  public path = '/offers';
  public router = Router();
  constructor(private readonly offerController: OfferController) {
    this.initializerRoutes();
  }
  private initializerRoutes() {
    //### offers routes that don't require authentication
    this.router.get(`${this.path}/:id`, isMongoId, this.offerController.getOfferById);
    this.router.get(`${this.path}`, this.offerController.getOffersByTaskId);
    //### offers routes that require authentication
    this.router.use(`${this.path}`, authenticateUser);
    this.router.post(`${this.path}`, createOfferValidator, this.offerController.createOffer);
    this.router.patch(`${this.path}/:id`, isMongoId, updateOfferValidator, this.offerController.updateOffer);
    this.router.delete(`${this.path}/:id`, isMongoId, this.offerController.deleteOffer);
  }
}

export { OfferRoute };
