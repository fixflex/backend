import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { ChatController } from '../controllers/chat.controller';
import { Routes } from '../interfaces/routes.interface';
import { authenticateUser } from '../middleware/auth.middleware';
import { createChatValidator } from '../middleware/validation/chat.validator';
import { isMongoId } from '../middleware/validation/isMongoID.validator';

@autoInjectable()
class ChatRoute implements Routes {
  public path = '/chats';
  public router = Router();

  constructor(private readonly chatController: ChatController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //  protected routes
    this.router.use(`${this.path}`, authenticateUser);
    this.router.post(`${this.path}`, createChatValidator, this.chatController.createChat);
    // get chat for logged in user
    this.router.get(`${this.path}`, this.chatController.getChatByUserId);
    this.router.get(`${this.path}/:id`, isMongoId, this.chatController.getChatById);
  }
}

export { ChatRoute };
