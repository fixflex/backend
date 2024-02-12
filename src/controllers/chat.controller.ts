import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import { Request, Response } from '../helpers';
import customResponse from '../helpers/customResponse';
import { IChat, IChatController } from '../interfaces/chat.interface';
import { ChatService } from '../services/chat.service';

@autoInjectable()
class ChatController implements IChatController {
  constructor(private readonly chatService: ChatService) {}

  getChatById = asyncHandler(async (req: Request, res: Response) => {
    // console.log('from chat controller');
    let chat = await this.chatService.getChatById(req.params.id);
    if (!chat) throw new HttpException(404, 'No chat found');
    res.status(200).json(customResponse<IChat>({ data: chat, success: true, message: 'Chat found' }));
  });

  getChatsByUserId = asyncHandler(async (req: Request, res: Response) => {
    let chat = await this.chatService.getChatsByUserId(req.user._id);
    if (!chat) throw new HttpException(404, 'No chat found');
    res.status(200).json({ results: chat.length, data: chat });
  });

  createChat = asyncHandler(async (req: Request<IChat>, res: Response) => {
    const chat = await this.chatService.createChat(req.body, req.user);
    res.status(201).json(customResponse<IChat>({ data: chat, success: true, message: 'Chat created' }));
  });
}

export { ChatController };
