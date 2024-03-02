import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { ReviewController } from '../controllers';
import { Routes } from '../interfaces';
import { authenticateUser } from '../middleware';
import { createReviewValidator, isMongoId, updateReviewValidator } from '../middleware/validation';

@autoInjectable()
class ReviewRoute implements Routes {
  public path = '/reviews';
  public router = Router();
  constructor(private readonly reviewController: ReviewController) {
    this.initializerRoutes();
  }
  private initializerRoutes() {
    // public routes
    this.router.get(`${this.path}`, this.reviewController.getReviews);
    this.router.get(`${this.path}/:id`, isMongoId, this.reviewController.getReviewById);

    // =================================================================== //
    // ====>>>====>>>====>>>  require authentication <<<====<<<====<<<==== //
    // =================================================================== //
    this.router.use(`${this.path}`, authenticateUser);
    this.router.post(`${this.path}`, createReviewValidator, this.reviewController.createReview);
    this.router.patch(`${this.path}/:id`, updateReviewValidator, this.reviewController.updateReview);
    this.router.delete(`${this.path}/:id`, this.reviewController.deleteReview);
  }
}

export { ReviewRoute };
