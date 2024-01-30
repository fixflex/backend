import { NextFunction, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import { Request } from '../helpers';
import customResponse from '../helpers/customResponse';
import { IOffer, IOfferController } from '../interfaces';
import { OfferService } from '../services/offer.service';

@autoInjectable()
class OfferController implements IOfferController {
  constructor(private readonly offerService: OfferService) {}

  createOffer = asyncHandler(async (req: Request<IOffer>, res: Response, next: NextFunction) => {
    const offer = await this.offerService.createOffer(req.body, req.user._id);
    if (!offer) return next(new HttpException(400, 'something_went_wrong'));
    res.status(201).json(customResponse({ data: offer, success: true, message: req.t('created_success') }));
  });

  getOffersByTaskId = asyncHandler(async (req: Request, res: Response) => {
    const offers = await this.offerService.getOffers(req.query.taskId as string);

    res.status(200).json(customResponse({ data: offers, success: true, message: null }));
  });

  getOfferById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const offer = await this.offerService.getOfferById(req.params.id);
    if (!offer) return next(new HttpException(404, 'resource_not_found'));
    res.status(200).json(customResponse({ data: offer, success: true, message: null }));
  });

  updateOffer = asyncHandler(async (req: Request<IOffer>, res: Response, next: NextFunction) => {
    const offer = await this.offerService.updateOffer(req.params.id, req.body, req.user._id);
    if (!offer) return next(new HttpException(404, 'resource_not_found'));
    res.status(200).json(customResponse({ data: offer, success: true, message: 'offer_updated' }));
  });

  deleteOffer = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const offer = await this.offerService.deleteOffer(req.params.id, req.user._id);
    if (!offer) return next(new HttpException(404, 'resource_not_found'));
    res.status(200).json(customResponse({ data: null, success: true, message: 'deleted_success' }));
  });
}

export { OfferController };
