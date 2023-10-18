import { Request } from 'express';

import { IUser } from './user.interface';

export interface AuthRequest extends Request {
  user?: IUser;
}
