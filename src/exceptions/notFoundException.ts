import { NextFunction, Request, Response } from 'express';

import HttpException from './HttpException';

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new HttpException(404, `Not found - ${req.originalUrl}`));
};
