import { NextFunction } from 'express';

import { Request, Response } from '../helpers/generic';
import { IPagination } from './respons.interface';

export interface IService {
  _id?: string;
  name: string;
  description: string;
  image: {
    url: string;
    publicId: string | null;
  };
}

export interface IServiceController {
  getServices(req: Request, res: Response, next: NextFunction): void;
  getServiceById(req: Request, res: Response, next: NextFunction): void;
  createService(req: Request, res: Response, next: NextFunction): void;
  updateService(req: Request, res: Response, next: NextFunction): void;
  deleteService(req: Request, res: Response, next: NextFunction): void;
  uploadServiceImage(req: Request, res: Response, next: NextFunction): void;
}

export interface IServiceService {
  getServices(reqQuery: any): Promise<{
    services: IService[] | null;
    paginate: IPagination;
  }>;
  getService(serviceId: string): Promise<IService | null>;
  createService(service: IService): Promise<IService>;
  updateService(serviceId: string, service: IService): Promise<IService | null>;
  deleteService(serviceId: string): Promise<IService | null>;
  uploadServiceImage(serviceId: string, file: Express.Multer.File): Promise<IService | null>;
}
