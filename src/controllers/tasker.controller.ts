import { NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import customResponse from '../helpers/customResponse';
import { Request, Response } from '../helpers/generic';
import { ITasker, ITaskerController } from '../interfaces/tasker.interface';
import { TaskerService } from '../services/tasker.service';

@autoInjectable()
class TaskerController implements ITaskerController {
  constructor(private readonly taskerService: TaskerService) {}
  createTasker = asyncHandler(async (req: Request<ITasker>, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    let user = await this.taskerService.createTasker(userId!, req.body);
    if (!user) return next(new HttpException(400, 'something_went_wrong')); //
    res.status(201).json(customResponse<ITasker>({ data: user, success: true, message: req.t('tasker_created') }));
  });

  getTaskerPublicProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let taskerId: string;
    taskerId = req.params.id;
    let tasker = await this.taskerService.getTasker(taskerId!);
    if (!tasker) return next(new HttpException(404, 'tasker_not_found'));
    res.status(200).json(customResponse<ITasker>({ data: tasker, success: true, message: req.t('tasker_found') }));
  });

  // get tasker profile by user id
  getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    let tasker = await this.taskerService.getMyProfile(userId!);
    if (!tasker) return next(new HttpException(404, 'tasker_not_found'));
    res.status(200).json(customResponse<ITasker>({ data: tasker, success: true, message: req.t('tasker_found') }));
  });
  getTaskers = asyncHandler(async (req: Request, res: Response) => {
    let { taskers, pagination } = await this.taskerService.getTaskers(req.query);
    res
      .status(200)
      .json(
        customResponse<ITasker[]>({ data: taskers, success: true, message: req.t('taskers_found'), pagination, results: taskers.length })
      );
  });

  updateMe = asyncHandler(async (req: Request<ITasker>, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    let updatedTasker = await this.taskerService.updateTasker(userId!, req.body);
    if (updatedTasker.modifiedCount == 0) return next(new HttpException(404, 'tasker_not_found'));
    res.status(200).json(customResponse({ data: null, success: true, message: req.t('tasker_updated') }));
  });

  deleteTasker = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.user?._id; //
    let user = await this.taskerService.deleteTasker(userId!);
    if (user.deletedCount == 0) return next(new HttpException(404, 'tasker_not_found'));
    res.status(204).json(customResponse({ data: null, success: true, message: req.t('tasker_deleted') }));
  });

  applyCoupon = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    let couponCode = req.body.couponCode;
    let appliedCoupon = await this.taskerService.applyCoupon(userId!, couponCode);
    if (!appliedCoupon) return next(new HttpException(400, 'coupon_not_applied'));
    res.status(200).json(customResponse({ data: null, success: true, message: req.t('coupon_applied') }));
  });

  // ====================== payment ====================== //

  checkout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let paymentLink = await this.taskerService.checkout(req.user, req.body);
    if (!paymentLink) return next(new HttpException(400, 'something_went_wrong'));
    res.status(200).json(customResponse({ data: paymentLink, success: true, message: req.t('payment_link_generated') }));
  });
}

export { TaskerController };
