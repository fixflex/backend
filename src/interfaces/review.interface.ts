import { Document } from 'mongoose';

export interface IReview extends Document {
  userId: string;
  taskerId: string;
  taskId: string;
  rating: number;
  review: string;
}
