import { NextFunction } from 'express';

import { Request, Response } from '../helpers/generic';

export interface ITasker {
  _id: string;
  userId: string;
  rating: number;
  bio: string;
  completedTasks: number;
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
