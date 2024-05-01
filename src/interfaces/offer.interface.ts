import { NextFunction } from 'express';
import { Document } from 'mongoose';

import { IPagination } from '.';
import { Request, Response } from '../helpers/generic';

export enum OfferStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
}

export interface IOffer extends Document {
  taskerId: string;
  taskId: string;
  message: string;
  price: number;
  status: OfferStatus;

  subMessages: {
    userId: string;
    message: string;
  }[];
  // images: {
  //   url: string;
  //   publicId: string | null;
  // }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IOfferController {
  getOffers(req: Request, res: Response, next: NextFunction): void;
  getOfferById(req: Request, res: Response, next: NextFunction): void;
  createOffer(req: Request, res: Response, next: NextFunction): void;
  updateOffer(req: Request, res: Response, next: NextFunction): void;
  deleteOffer(req: Request, res: Response, next: NextFunction): void;
}

export interface IOfferService {
  // getOffers(taskId: string | undefined): Promise<IOffer[] | null>;
  getOffers(reqQuery: any): Promise<{ offers: IOffer[]; pagination: IPagination | undefined }>;
  getOfferById(offerId: string): Promise<IOffer | null>;

  createOffer(offer: IOffer, userId: string | undefined): Promise<IOffer>;
  updateOffer(offerId: string, offer: Partial<IOffer>, userId: string | undefined): Promise<IOffer | null>;
  deleteOffer(offerId: string, userId: string | undefined): Promise<IOffer | null>;
}
