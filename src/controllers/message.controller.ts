import { NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import { Request, Response } from '../helpers';
import customResponse from '../helpers/customResponse';
import { IMessage, IMessageController } from '../interfaces';
import { MessageService } from '../services';

@autoInjectable()
class MessageController implements IMessageController {
  constructor(private readonly messageService: MessageService) {}
  getMessages(req: Request<Record<string, any>>, res: Response, next: NextFunction): void {
    throw new Error('Method not implemented.');
  }
  getMessageById(req: Request<Record<string, any>>, res: Response, next: NextFunction): void {
    throw new Error('Method not implemented.');
  }
  getMessagesByChatId(req: Request<Record<string, any>>, res: Response, next: NextFunction): void {
    throw new Error('Method not implemented.');
  }
  deleteMessage(req: Request<Record<string, any>>, res: Response, next: NextFunction): void {
    throw new Error('Method not implemented.');
  }

  //   getChatById = asyncHandler(async (req: Request, res: Response) => {
  //     let chat = await this.messageService.geessageServicetChatById(req.params.id);
  //     if (!chat) throw new HttpException(404, 'No chat found');
  //     res.status(200).json(customResponse<IMessage>({ data: chat, success: true, message: 'Chat found' }));
  //   });

  //   getChatsByUserId = asyncHandler(async (req: Request, res: Response) => {
  //     let chat = await this.messageService.geessageServicetChatsByUserId(req.user._id);
  //     if (!chat) throw new HttpException(404, 'No chat found');
  //     res.status(200).json({ results: chat.length, data: chat });
  //   });

  createMessage = asyncHandler(async (req: Request<IMessage>, res: Response) => {
    const chat = await this.messageService.createMessage(req.body, req.user);
    res.status(201).json(customResponse<IMessage>({ data: chat, success: true, message: 'Message created' }));
  });
}

export { MessageController };
