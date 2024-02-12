import { NextFunction } from 'express';
import { Document } from 'mongoose';

import { IUser } from '.';
import { Request, Response } from '../helpers';

export interface IMessage extends Document {
  _id?: string;
  sender: string; // ref: User
  message: string;
  chatId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMessageController {
  getMessages(req: Request, res: Response, next: NextFunction): void;
  getMessageById(req: Request, res: Response, next: NextFunction): void;
  createMessage(req: Request, res: Response, next: NextFunction): void;
  getMessagesByChatId(req: Request, res: Response, next: NextFunction): void;
  deleteMessage(req: Request, res: Response, next: NextFunction): void;
}

export interface IMessageService {
  getMessages(reqQuery: any): Promise<IMessage[] | null>;
  getMessageById(messageId: string): Promise<IMessage | null>;
  getMessagesByChatId(chatId: string): Promise<IMessage[] | null>;

  createMessage(message: IMessage, user: IUser): Promise<IMessage>;
  deleteMessage(messageId: string): Promise<any>;
}
