import { NextFunction } from 'express';
import { Document } from 'mongoose';

import { IPagination } from '.';
import { Request, Response } from '../helpers/generic';
import { PaymentMethod } from './transaction.interface';

export enum TaskStatus {
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  // DONE = 'DONE',
  // IN_PROGRESS = 'IN_PROGRESS',
  // CANCELED = 'CANCELED',
}

export enum TaskTime {
  MORNING = 'MORNING',
  MIDDAY = 'MIDDAY',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
}
//  TODO: Add question and answer to the task model
export interface ITask extends Document {
  _id: string;
  userId: string;
  // taskerId: { type: Schema.Types.ObjectId; ref: 'Tasker' };
  dueDate: {
    on: Date;
    before: Date;
    flexible: boolean;
  };
  time: TaskTime[];
  title: string;
  details: string;
  imageCover: {
    url: string;
    publicId: string | null;
  };
  images: {
    url: string;
    publicId: string | null;
  }[];
  categoryId: string;
  status: TaskStatus;
  location: {
    type: {
      enum: ['Point'];
      default: 'Point';
    };
    coordinates: [number, number];
    online: boolean;
  };
  budget: number;
  offers: string[];
  acceptedOffer: string | undefined;
  createdAt?: string;
  updatedAt?: string;
  // ======================================================================================================== //
  transcactionId: string;
  paymentMethod: PaymentMethod;
  commission: number;
  commissionAfterDescount: number;
  // paymentMethod: {
  //   type: string;
  //   card: {
  //     cardNumber: string;
  //     cardHolderName: string;
  //     expiryDate: string;
  //     cvc: string;
  //   };
  //   vodafoneCash: {
  //     phoneNumber: string;
  //     pin: string;
  //   };
  // };
}

export interface ITaskController {
  getTasks(req: Request, res: Response, next: NextFunction): void;
  getTaskById(req: Request, res: Response, next: NextFunction): void;
  // getTaskOffers(req: Request, res: Response, next: NextFunction): void;
  // getTaskOwner(req: Request, res: Response, next: NextFunction): void;
  // getTaskTasker(req: Request, res: Response, next: NextFunction): void;
  // getTaskChat(req: Request, res: Response, next: NextFunction): void;

  createTask(req: Request, res: Response, next: NextFunction): void;
  updateTask(req: Request, res: Response, next: NextFunction): void;
  uploadTaskImages(req: Request, res: Response, next: NextFunction): void;
  deleteTask(req: Request, res: Response, next: NextFunction): void;
}

export interface ITaskService {
  getTasks(reqQuery: any): Promise<{ tasks: ITask[]; pagination: IPagination | undefined }>;
  getTaskById(taskId: string): Promise<ITask | null>;
  // getTaskOffers(taskId: string): Promise<any>;
  // getTaskOwner(taskId: string): Promise<any>;
  // getTaskTasker(taskId: string): Promise<any>;
  // getTaskChat(taskId: string): Promise<any>;

  createTask(task: ITask): Promise<ITask>;
  updateTask(taskId: string, task: ITask, userId: string | undefined): Promise<any>;
  deleteTask(taskId: string, userId: string | undefined): Promise<any>;
}
