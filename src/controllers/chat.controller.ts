import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import customResponse from '../helpers/customResponse';
import { AuthRequest } from '../interfaces/auth.interface';
import { IChat, IChatController } from '../interfaces/chat.interface';
import { ChatService } from '../services/chat.service';

@autoInjectable()
class ChatController implements IChatController {
  constructor(private readonly chatService: ChatService) {}

  getChatById = asyncHandler(async (req: AuthRequest, res: Response) => {
    // console.log('from chat controller');
    let chat = await this.chatService.getChatById(req.params.id);
    if (!chat) throw new HttpException(404, 'No chat found');
    res.status(200).json(customResponse<IChat>({ data: chat, success: true, message: 'Chat found' }));
  });

  getChatByUserId = asyncHandler(async (req: AuthRequest, res: Response) => {
    let chat = await this.chatService.getChatByUserId(req.user?._id!);
    if (!chat) throw new HttpException(404, 'No chat found');
    res.status(200).json({ results: chat.length, data: chat });
  });

  createChat = asyncHandler(async (req: AuthRequest, res: Response) => {
    const chat = await this.chatService.createChat(req.body);
    res.status(201).json(customResponse<IChat>({ data: chat, success: true, message: 'Chat created' }));
  });
}

export { ChatController };
