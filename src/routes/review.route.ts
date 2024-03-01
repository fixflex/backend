import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { ReviewController } from '../controllers';
import { Routes } from '../interfaces';
import { authenticateUser } from '../middleware';
import { createReviewValidator } from '../middleware/validation';

@autoInjectable()
class ReviewRoute implements Routes {
  public path = '/reviews';
  public router = Router();
  constructor(private readonly reviewController: ReviewController) {
    this.initializerRoutes();
  }
  private initializerRoutes() {
    // =================================================================== //
    // ====>>>====>>>====>>>  require authentication <<<====<<<====<<<==== //
    // =================================================================== //
    this.router.use(`${this.path}`, authenticateUser);
    this.router.post(`${this.path}`, createReviewValidator, this.reviewController.createReview);
  }
}

export { ReviewRoute };
