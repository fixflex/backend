import { NextFunction, Request, Response } from 'express';

import HttpException from '../../exceptions/HttpException';
import { ErrorResponse } from '../../interfaces';
import logger from '../../utils/log';

export const errorMiddleware = (err: HttpException, _req: Request, res: Response<ErrorResponse>, _next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Something went wrong';
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendForDev(err, res);
  } else {
    if (err.name === 'CastError') {
      err = handelCastErrorDB(err);
    }
    if (err.code === 11000) {
      err = handelDuplicateFieldsDB(err);
    }
    if (err.name === 'ValidationError') {
      err = handelValidationErrorDB(err);
    }

    if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignture();
    if (err.name === 'TokenEpiredError') err = handleJwtExpired();

    // MulterError
    if (err.name === 'MulterError') err = handleMulterError(err);
    sendForProd(err, res);
  }
};

const handelCastErrorDB = (err: HttpException) => {
  const message = `Invalid ${err.path}: ${err.value} `;
  return new HttpException(400, message);
};

const handelDuplicateFieldsDB = (err: HttpException) => {
  let value = err.message.match(/(["'])(\\?.)*?\1/)![0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new HttpException(400, message);
};

const handelValidationErrorDB = (err: HttpException) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new HttpException(400, message);
};

const handleJwtInvalidSignture = () => new HttpException(401, 'Invalid token, please login again..');

const handleJwtExpired = () => new HttpException(401, 'Expired token, please login again..');

const handleMulterError = (err: HttpException) => {
  let message = '';
  if (err.code === ('LIMIT_UNEXPECTED_FILE' as number | string)) {
    message = `Too many files uploaded.`;
  } else if (err.code === ('LIMIT_FILE_SIZE' as number | string)) {
    message = `File too large.`;
  } else {
    message = err.message;
  }
  return new HttpException(400, message);
};

//################### send error response ###################//

const sendForDev = (err: HttpException, res: Response) => {
  res.status(err.statusCode).json({
    data: null,
    success: false,
    error: true,
    message: err.message,
    status: err.status,
    stack: err.stack,
    err,
  });
};

const sendForProd = (err: HttpException, res: Response) => {
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      data: null,
      success: false,
      error: true,
      message: err.message,
      status: err.status,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  else {
    // 1) Log error
    logger.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({ status: 'error', message: 'Something went wrong!' });
  }
};
