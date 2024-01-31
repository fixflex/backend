import { NextFunction } from 'express';
import { Document } from 'mongoose';

import { Request, Response } from '../helpers/generic';

export interface IChat extends Document {
  _id: string;
  client: string; // ref: User
  tasker: string; // ref: User
  messages: string[];
}

export interface IChatController {
  // getChats(req: Request, res: Response, next: NextFunction): void;
  getChatById(req: Request, res: Response, next: NextFunction): void;
  createChat(req: Request, res: Response, next: NextFunction): void;
  getChatByUserId(req: Request, res: Response, next: NextFunction): void;
  // deleteChat(req: Request, res: Response, next: NextFunction): void;
}

export interface IChatService {
  // getChats(reqQuery: any): Promise<IChat[] | null>;
  getChatById(chatId: string): Promise<IChat | null>;
  getChatByUserId(userId: string): Promise<IChat[] | null>;

  createChat(chat: IChat): Promise<IChat>;
  // deleteChat(chatId: string): Promise<any>;
}
