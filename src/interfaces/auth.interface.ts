import { Request } from 'express';
import { IUser } from './User.interface'

export interface AuthRequest extends Request {
    user?: IUser
}