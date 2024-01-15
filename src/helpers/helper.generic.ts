import { Request as ExpressRequest, Response as ExpressRespons } from 'express';

export interface Response extends ExpressRespons {}

export interface Request<T = Record<string, any>> extends ExpressRequest {
  body: T;
}
