import { NextFunction, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import customResponse from '../helpers/customResponse';
import { IOfferController } from '../interfaces';
import { AuthRequest } from '../interfaces/auth.interface';
import { OfferService } from '../services/offer.service';

@autoInjectable()
class OfferController implements IOfferController {
  constructor(private readonly offerService: OfferService) {}

  createOffer = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const offer = await this.offerService.createOffer(req.body, req.user?._id);

    if (!offer) return next(new HttpException(400, 'Something went wrong, please try again later'));
    res.status(201).json(customResponse({ data: offer, success: true, message: 'Offer created' }));
  });

  getOffersByTaskId = asyncHandler(async (req: AuthRequest, res: Response) => {
    const offers = await this.offerService.getOffers(req.query.taskId as string);

    res.status(200).json(customResponse({ data: offers, success: true, message: null }));
  });

  getOfferById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const offer = await this.offerService.getOfferById(req.params.id);
    if (!offer) return next(new HttpException(404, `Offer with id ${req.params.id} not found`));
    res.status(200).json(customResponse({ data: offer, success: true, message: null }));
  });

  updateOffer = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const offer = await this.offerService.updateOffer(req.params.id, req.body, req.user?._id);
    if (!offer) return next(new HttpException(404, `Offer with id ${req.params.id} not found`));
    res.status(200).json(customResponse({ data: offer, success: true, message: 'Offer updated' }));
  });

  deleteOffer = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const offer = await this.offerService.deleteOffer(req.params.id, req.user?._id);
    if (!offer) return next(new HttpException(404, `Offer with id ${req.params.id} not found`));
    res.status(200).json(customResponse({ data: null, success: true, message: 'Offer deleted' }));
  });
}

export { OfferController };
