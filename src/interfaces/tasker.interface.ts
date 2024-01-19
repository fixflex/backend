import { NextFunction } from 'express';

import { Request, Response } from '../helpers/generic';

export interface ITasker {
  _id?: string; // tasker id
  userId: string; // user id
  rating: number; // average of reviews
  bio: string;
  completedTasks: number;
  services: string[];
  phoneNumber: string;
  location: {
    type: {
      type: string;
      enum: ['Point'];
      default: 'Point';
    };
    coordinates: [number, number];
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  isActive: boolean;
  isVerified: boolean;

  // hours: {
  //   monday: IHours;
  //   tuesday: IHours;
  //   wednesday: IHours;
  //   thursday: IHours;
  //   friday: IHours;
  //   saturday: IHours;
  //   sunday: IHours;
  // };
  // availability: {
  //   monday: boolean;
  //   tuesday: boolean;
  //   wednesday: boolean;
  //   thursday: boolean;
  //   friday: boolean;
  //   saturday: boolean;
  //   sunday: boolean;
  // };

  // serviceArea: {
  //   radius: number;
  //   coordinates: [number, number];
  // };
  // serviceRadius: number;
  // serviceArea: {
  //   type: {
  //     type: string;
  //     enum: ['Point'];
  //     default: 'Point';
  //   };
  //   coordinates: [number, number];
  // };
  // serviceAreaRadius: number;
  // serviceArea: {
  //   type: string;
  //   coordinates: [number, number];
  //   radius: number;
  // };
  // serviceArea: {
  //   type: {
  //     type: string;
  //     enum: ['Point'];
  //     default: 'Point';
  //   };
  //   coordinates: [number, number];
  //   radius: number;
  // };
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
  getTaskers(reqQuery: any): Promise<ITasker[] | null>;
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
