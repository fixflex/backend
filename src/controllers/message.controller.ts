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

  createMessage = asyncHandler(async (req: Request<IMessage>, res: Response) => {
    const chat = await this.messageService.createMessage(req.body, req.user);
    res.status(201).json(customResponse<IMessage>({ data: chat, success: true, message: 'Message created' }));
  });

  getMessagesByChatId = asyncHandler(async (req: Request, res: Response) => {
    let messages = await this.messageService.getMessagesByChatId(req.params.id, req.user);
    if (!messages) throw new HttpException(404, 'No chat found');
    res.status(200).json({ results: messages.length, data: messages });
  });

  deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    let message = await this.messageService.deleteMessage(req.params.id, req.user);
    if (!message) throw new HttpException(404, 'No chat found');
    res.status(200).json(customResponse<IMessage>({ data: message, success: true, message: 'Message deleted' }));
  });
}

export { MessageController };
