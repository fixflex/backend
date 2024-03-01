import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import { customResponse } from '../helpers';
import { NextFunction, Request, Response } from '../helpers';
import { IReview, IReviewController } from '../interfaces';
import { ReviewServiec } from '../services';

@autoInjectable()
class ReviewController implements IReviewController {
  constructor(private readonly reviewService: ReviewServiec) {}
  async createReview(req: Request<IReview>, res: Response, next: NextFunction) {
    let review = await this.reviewService.createReview(req.body);
    if (!review) return next(new HttpException(400, 'something_went_wrong'));
    res.status(201).json(customResponse({ data: review, success: true, message: req.t('review_created') }));
  }
}

export { ReviewController };
