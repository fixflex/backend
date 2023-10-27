import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import HttpException from '../exceptions/HttpException';
import { ChatService } from '../services/chat.service';

class ChatController {
  constructor(private readonly chatService: ChatService) {}

  getChatById = asyncHandler(async (req: Request, res: Response) => {
    let chat = await this.chatService.getChatById(req.params.id);
    if (!chat) throw new HttpException(404, 'No chat found');
    res.status(200).json({ data: chat });
  });

  createChat = asyncHandler(async (req: Request, res: Response) => {
    const chat = await this.chatService.createChat(req.body);
    res.status(201).json({ data: chat });
  });
}

export { ChatController };
