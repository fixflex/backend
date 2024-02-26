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

  getOffers = asyncHandler(async (req: Request, res: Response) => {
    const { offers, pagination } = await this.offerService.getOffers(req.query);
    res.status(200).json(customResponse({ data: offers, success: true, message: null, pagination, results: offers.length }));
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

  acceptOffer = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const offer = await this.offerService.acceptOffer(req.params.id, req.user._id);
    if (!offer) return next(new HttpException(400, 'something_went_wrong'));
    res.status(200).json(customResponse({ data: offer, success: true, message: 'offer_accepted' }));
  });

  checkoutOffer = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const offer = await this.offerService.checkoutOffer(req.params.id, req.user, req.body);
    if (!offer) return next(new HttpException(400, 'something_went_wrong'));
    res.status(200).json(customResponse({ data: offer, success: true, message: 'offer_checked_out' }));
  });

  webhookCheckout = asyncHandler(async (req: Request, res: Response) => {
    // call the offerService to handle the paymob webhook
    let results = await this.offerService.webhookCheckout(req);
    res.status(200).json({ received: true, results });
  });

  webhookCheckoutSuccess = asyncHandler(async (_req: Request, res: Response) => {
    // call the offerService to handle the paymob webhook
    // let results = await this.offerService.webhookCheckoutSuccess(req);
    // console.log('webhookCheckoutSuccess ===================>> ', req.query);
    // res.status(200).json({ message: 'webhookCheckoutSuccess', query: req.query, body: req.body, params: req.params });
    res.status(200).json({ message: 'webhookCheckoutSuccess' });
  });
  // webhookCheckoutWallet = asyncHandler(async (req: Request, res: Response) => {
  //   // call the offerService to handle the paymob webhook
  //   console.log('webhookCheckoutWallet ===================>> ', req.query);
  //   console.log('webhookCheckoutWallet ===================>> ', req.body);
  //   // let results = await this.offerService.webhookCheckout(req);
  //   res.status(200).json({ received: true });
  // });

  // webhookCheckoutSuccessWallet = asyncHandler(async (req: Request, res: Response) => {
  //   // call the offerService to handle the paymob webhook
  //   // let results = await this.offerService.webhookCheckoutSuccess(req);
  //   // console.log('webhookCheckoutSuccess ===================>> ', req.query);
  //   console.log('webhookCheckoutSuccessWallet ===================>> ', req.query);
  //   console.log('webhookCheckoutSuccessWallet ===================>> ', req.body);
  //   res.status(200).json({ message: 'webhookCheckoutSuccessWallet', query: req.query });
  // });
}

export { OfferController };
