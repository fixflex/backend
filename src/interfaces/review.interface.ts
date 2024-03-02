import { Document } from 'mongoose';

import { IPagination } from '.';
import { NextFunction, Request, Response } from '../helpers';

export interface IReview extends Document {
  userId: string;
  taskId: string;
  rating: number;
  review: string;
}

export interface IReviewController {
  createReview(req: Request, res: Response, next: NextFunction): void;
}

export interface IReviewService {
  createReview(review: IReview, userId: string): Promise<IReview>;
  getReviews(query: any): Promise<{ reviews: IReview[]; pagination: IPagination | undefined }>;
  getReview?(reviewId: string): Promise<IReview | null>;
  // updateReview?(reviewId: string, review: IReview, userId: string) : Promise<IReview | null>;
  // deleteReview?(reviewId: string): Promise<IReview | null>;
}
