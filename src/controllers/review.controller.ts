import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import { customResponse } from '../helpers';
import { NextFunction, Request, Response } from '../helpers';
import { IReview, IReviewController } from '../interfaces';
import { ReviewServiec } from '../services';

@autoInjectable()
class ReviewController implements IReviewController {
  constructor(private readonly reviewService: ReviewServiec) {}
  createReview = asyncHandler(async (req: Request<IReview>, res: Response, next: NextFunction) => {
    let review = await this.reviewService.createReview(req.body, req.user._id.toString());
    if (!review) return next(new HttpException(400, 'something_went_wrong'));
    res.status(201).json(customResponse({ data: review, success: true, message: req.t('review_created') }));
  });

  getReviewById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let review = await this.reviewService.getReviewById(req.params.id);
    if (!review) return next(new HttpException(404, 'review_not_found'));
    res.status(200).json(customResponse({ data: review, success: true, message: req.t('review_fetched') }));
  });

  updateReview = asyncHandler(async (req: Request<IReview>, res: Response, next: NextFunction) => {
    let review = await this.reviewService.updateReview(req.params.id, req.body, req.user._id.toString());
    if (!review.modifiedCount) return next(new HttpException(400, 'something_went_wrong'));
    res.status(200).json(customResponse({ data: review, success: true, message: req.t('review_updated') }));
  });

  deleteReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let review = await this.reviewService.deleteReview(req.params.id, req.user._id.toString());
    if (!review.deletedCount) return next(new HttpException(400, 'something_went_wrong'));
    res.status(204).json(customResponse({ data: null, success: true, message: req.t('review_deleted') }));
  });
}

export { ReviewController };
