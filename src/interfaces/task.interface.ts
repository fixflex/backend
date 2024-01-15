import { NextFunction } from 'express';

import { Request, Response } from '../helpers/helper.generic';

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface ITask {
  _id?: number;
  ownerId: string;
  dueDate: {
    start: Date;
    end: Date;
    flxible: boolean;
  };
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
  service: string;
  status: TaskStatus;
  location: {
    type: {
      enum: ['Point'];
      default: 'Point';
    };
    coordinates: [number, number];
  };
  city: string;
  budget: number;
  offer: string;
  createdAt?: string;
  updatedAt?: string;
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
  getTasks(reqQuery: any): Promise<ITask[] | null>;
  getTaskById(taskId: string): Promise<ITask | null>;
  // getTaskOffers(taskId: string): Promise<any>;
  // getTaskOwner(taskId: string): Promise<any>;
  // getTaskTasker(taskId: string): Promise<any>;
  // getTaskChat(taskId: string): Promise<any>;

  createTask(task: ITask): Promise<ITask>;
  updateTask(taskId: string, task: ITask, userId: string | undefined): Promise<any>;
  deleteTask(taskId: string, userId: string | undefined): Promise<any>;
}
