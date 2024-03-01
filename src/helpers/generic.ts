import { NextFunction as ExpressNextFunction, Request as ExpressRequest, Response as ExpressRespons } from 'express';

export interface Response extends ExpressRespons {}
export interface NextFunction extends ExpressNextFunction {}
export interface Request<T = Record<string, any>> extends ExpressRequest {
  body: T;
  user?: any;
}

export interface IPopulate {
  path: string;
  select?: string;
}
