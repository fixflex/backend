import { NextFunction, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../../exceptions/HttpException';
import customResponse from '../../helpers/customResponse';
import { AuthRequest } from '../../interfaces/auth.interface';
import { OfferService } from '../../services/tasks/offer.service';

@autoInjectable()
class OfferController {
  constructor(private readonly offerService: OfferService) {}

  createOffer = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const offer = await this.offerService.createOffer(req.body, req.user?._id);

    if (!offer) return next(new HttpException(400, 'Something went wrong, please try again later'));
    res.status(201).json(customResponse({ data: offer, success: true, status: 201, message: 'Offer created', error: false }));
  });

  getOffersByTaskId = asyncHandler(async (req: AuthRequest, res: Response) => {
    const offers = await this.offerService.getOffers(req.query.taskId as string);

    res.status(200).json(customResponse({ data: offers, success: true, status: 200, message: null, error: false }));
  });

  getOfferById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const offer = await this.offerService.getOfferById(req.params.id);
    if (!offer) return next(new HttpException(404, `Offer with id ${req.params.id} not found`));
    res.status(200).json(customResponse({ data: offer, success: true, status: 200, message: null, error: false }));
  });

  updateOffer = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const offer = await this.offerService.updateOffer(req.params.id, req.body, req.user?._id);
    if (!offer) return next(new HttpException(404, `Offer with id ${req.params.id} not found`));
    res.status(200).json(customResponse({ data: offer, success: true, status: 200, message: 'Offer updated', error: false }));
  });

  deleteOffer = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const offer = await this.offerService.deleteOffer(req.params.id, req.user?._id);
    if (!offer) return next(new HttpException(404, `Offer with id ${req.params.id} not found`));
    res.status(200).json(customResponse({ data: null, success: true, status: 204, message: 'Offer deleted', error: false }));
  });
}

export { OfferController };
