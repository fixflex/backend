import { NextFunction } from 'express';

import { Request, Response } from '../helpers/generic';

export enum OfferStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
}

export interface IOffer {
  _id?: string;
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
  getOffersByTaskId(req: Request, res: Response, next: NextFunction): void;
  getOfferById(req: Request, res: Response, next: NextFunction): void;
  createOffer(req: Request, res: Response, next: NextFunction): void;
  updateOffer(req: Request, res: Response, next: NextFunction): void;
  deleteOffer(req: Request, res: Response, next: NextFunction): void;
}

export interface IOfferService {
  // getOffers(taskId: string | undefined): Promise<IOffer[] | null>;
  getOfferById(offerId: string): Promise<IOffer | null>;

  createOffer(offer: IOffer, userId: string | undefined): Promise<IOffer>;
  updateOffer(offerId: string, offer: Partial<IOffer>, userId: string | undefined): Promise<IOffer | null>;
  deleteOffer(offerId: string, userId: string | undefined): Promise<IOffer | null>;
}

// the offer should be like this :
// {
//   "taskerId": "5f2e1c2f1c9d440000b3f4d9",
//   "taskId": "5f2e1c2f1c9d440000b3f4d9",
//   "message": "this is the message",
//   "subMessages": [
//     {
//       "sender": "5f2e1c2f1c9d440000b3f4d9",
//       "message": "this is the message"
//     }
//   ],
//   "images": [
//     {
//       "url": "https://res.cloudinary.com/djnv06fje/image/upload/v1596854755/Taskr/offerImages/5f2e1c2f1c9d440000b3f4d9/offerImage_1_1596854755.jpg",
//       "publicId": "Taskr/offerImages/5f2e1c2f1c9d440000b3f4d9/offerImage_1_1596854755"
//     }
//   ]
// }
