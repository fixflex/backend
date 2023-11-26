import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import { IService } from '../interfaces/services.interface';
import { ServiceService } from '../services/service.service';
import customResponse from '../utils/customResponse';

@autoInjectable()
class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  // public Routes
  public getService = asyncHandler(async (req: Request, res: Response) => {
    let service = await this.serviceService.getService(req.params.id);
    if (!service) throw new HttpException(404, 'No service found');
    res.status(200).json(customResponse<IService>({ data: service, success: true, status: 200, message: 'Service found', error: false }));
  });

  public getServices = asyncHandler(async (req: Request, res: Response) => {
    let { services, paginate } = await this.serviceService.getServices(req.query);

    res.status(200).json(Object.assign(customResponse<IService[]>({ data: services!, success: true, status: 200, message: 'Services found', error: false }), { paginate }));
  });

  // authenticated routes
  public createService = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return next(new HttpException(400, 'Please provide a service'));

    let service = await this.serviceService.createService(req.body);
    res.status(201).json({ data: service });
  });

  public updateService = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return next(new HttpException(400, 'Please provide a service'));

    let service = await this.serviceService.updateService(req.params.id, req.body);
    if (!service) return next(new HttpException(404, 'No service found'));
    res.status(200).json({ data: service });
  });

  public uploadServiceImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next(new HttpException(400, 'Please provide an image'));

    let service = await this.serviceService.uploadServiceImage(req.params.id, req.file);
    if (!service) return next(new HttpException(404, 'No service found'));
    res.status(200).json({ data: service });
  });

  public deleteService = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let service = await this.serviceService.deleteService(req.params.id);
    if (!service) return next(new HttpException(404, 'No service found'));
    res.sendStatus(204);
  });
}

export { ServiceController };
