import { NextFunction } from 'express';
import { Document } from 'mongoose';

import { IPagination } from '.';
import { Request, Response } from '../helpers/generic';

export interface ITasker extends Document {
  userId: string;
  ratingAverage: number;
  ratingQuantity: number;
  bio: string;
  categories: string[];
  location: {
    type: string;
    coordinates: [number, number];
    radius: number;
  };
  isActive: boolean;
  isVerified: boolean;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  workingHours: {
    start: string;
    end: string;
  };
  age: number;
  notPaidTasks: string[]; // taskIds that the tasker has to pay commission for
  totalCanceledTasks: number;
  totalEarnings: number;
  netEarnings: number;
  completedTasks: string[];
  commissionRate: number;
  balance: number; // the amount of money that the tasker has in his account (wallet)
  portfolio: { url: string; publicId: string | null }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskerController {
  getTaskerPublicProfile(req: Request, res: Response, next: NextFunction): void;
  getTaskers(req: Request, res: Response, next: NextFunction): void;
  createTasker(req: Request, res: Response, next: NextFunction): void;
  updateMe(req: Request, res: Response, next: NextFunction): void;
  deleteTasker(req: Request, res: Response, next: NextFunction): void;
}

export interface ITaskerService {
  getTasker(taskerId: string): Promise<ITasker | null>;
  getTaskers(reqQuery: any): Promise<{ taskers: ITasker[]; pagination: IPagination | undefined }>;
  createTasker(userId: string, tasker: ITasker): Promise<ITasker>;
  updateTasker(userId: string, tasker: Partial<ITasker>): Promise<any>;
  deleteTasker(taskerId: string): Promise<any>;
}
