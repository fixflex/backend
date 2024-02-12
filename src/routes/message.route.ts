import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { MessageController } from '../controllers';
import { Routes } from '../interfaces/routes.interface';
import { authenticateUser } from '../middleware/auth.middleware';
import { createMessageValidator } from '../middleware/validation';
import { isMongoId } from '../middleware/validation/isMongoID.validator';

@autoInjectable()
class MessageRoute implements Routes {
  public path = '/messages';
  public router = Router();

  constructor(private readonly messageController: MessageController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //  protected routes
    this.router.use(`${this.path}`, authenticateUser);
    this.router.post(`${this.path}`, createMessageValidator, this.messageController.createMessage);
    // get chat for logged in user
    // this.router.get(`${this.path}`, this.messageController.getMessages);
    this.router.get(`${this.path}/:id`, isMongoId, this.messageController.getMessageById);
    this.router.get(`${this.path}/chat/:id`, isMongoId, this.messageController.getMessagesByChatId);
    // this.router.delete(`${this.path}/:id`, isMongoId, this.messageController.deleteMessage);
  }
}

export { MessageRoute };
