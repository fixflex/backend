import { NextFunction } from 'express';
import { Document } from 'mongoose';

import { IPagination } from '.';
import { Request, Response } from '../helpers/generic';

// export interface IPaymentMethod {
//   vodafoneCach: {
//     name: string;
//     number: string;
//   };
//   etisalatCach: {
//     name: string;
//     number: string;
//   };
//   orangeCach: {
//     name: string;
//     number: string;
//   };
//   fawry: {
//     name: string;
//     number: string;
//   };
//   bankTransfer: {
//     bankName: string;
//     bankAccountNumber: string;
//     bankAccountName: string;
//     bankAccountIBAN: string;
//     bankAccountSwiftCode: string;
//     bankAccountAddress: string;
//   };
// }

// export enum PaymentMethod {
//   VODAFONE_CASH = 'VODAFONE_CASH',
//   // ETISALAT_CASH = 'ETISALAT_CASH',
//   // ORANGE_CASH = 'ORANGE_CASH',
//   // FAWRY = 'FAWRY',
//   // BANK_TRANSFER = 'BANK_TRANSFER',
// }

export interface ITasker extends Document {
  _id: string;
  userId: string;
  rating: number;
  bio: string;
  // completedTasks: number;
  categories: string[];
  phoneNumber: string;
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
  createdAt: Date;
  updatedAt: Date;

  // ======================================================================================================== //

  commissionsToPay: {
    taskId: string;
    ratio: number; // the ratio of the commission that the tasker has to pay  (task price * ratio)
    amount: number; // the amount of the commission that the tasker has to pay (task price * ratio) (task price * commission percentage) (task price * commission ratio) (task price * commission amount) ex: 100 * 0.2 = 20 (20%) (20% of the task price)
  }[];
  totalCanceledTasks: number;
  totalEarnings: number;
  netEarnings: number;
  completedTasks: string[];
  commissionRatio: number;

  // ======================================================================================================== //

  // commissionRate: { type: Number; default: 0.1 }; // 10% of the task price

  // commissionsToPay: {
  //   taskId: string;
  //   ratio: number; // the ratio of the commission that the tasker has to pay  (task price * ratio)
  //   amount: number; // the amount of the commission that the tasker has to pay (task price * ratio) (task price * commission percentage) (task price * commission ratio) (task price * commission amount) ex: 100 * 0.2 = 20 (20%) (20% of the task price)
  // }[];
  // commissions: {
  //   taskId: string;
  //   ratio: number;
  //   amount: number;
  // }[];
  // // totalPaidCommission: number;
  // // totalUnpaidCommission: number;

  // completedTasks: {
  //   taskId: string;
  //   commissionToPay: {
  //     ratio: number;
  //     amount: number;
  //     paid: boolean;
  //     paidAt: Date;
  //     paidMethod: PaymentMethod;
  //   }[];
  //   paidAt: Date;
  //   paidMethod: PaymentMethod;
  // }[];

  // totalEarnings: number;
  // netEarnings: number;

  // pendingCommissions: number;
  // totalCanceledTasks: number;
  // totalAcceptedOffers: number;
  // netIncome: number;

  // earnings: {
  //   taskId: string;
  //   ratio: number;
  //   amount: number;
  // }[];
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

// export interface ITaskerRepository {
//   getTasker(taskerId: string): Promise<ITasker | null>;
//   getTaskers(): Promise<ITasker[]>;
//   createTasker(tasker: ITasker): Promise<ITasker>;
//   updateTasker(taskerId: string, tasker: Partial<ITasker>): Promise<ITasker | null>;
//   deleteTasker(taskerId: string): Promise<ITasker | null>;
// }
