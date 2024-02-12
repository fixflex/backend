import { autoInjectable } from 'tsyringe';

import { io } from '..';
import { MessageDao } from '../DB/dao';
import { ChatDao } from '../DB/dao/chat.dao';
import HttpException from '../exceptions/HttpException';
import { IMessage, IMessageService, IUser } from '../interfaces';

@autoInjectable()
class MessageService implements IMessageService {
  async createMessage(data: IMessage, user: IUser) {
    // 1. check if chat exists
    let chat = await this.chatDao.getOne({ _id: data.chatId });
    if (!chat) throw new HttpException(404, 'Chat not found');
    // 2. check if user is part of the chat
    if (chat.user !== user._id.toString() && chat.tasker !== user._id.toString())
      throw new HttpException(403, 'You are not part of this chat');
    // 3. create message
    let message = await this.messageDao.create(data);
    // 5. Push message to chat messages array
    await this.chatDao.updateOneById(chat._id, { $push: { messages: message._id } });
    // 6. emit message to chat room
    io.to(chat._id.toString()).emit('message', message);
    // 7. return message
    return message;
  }
  constructor(private chatDao: ChatDao, private messageDao: MessageDao) {}
  getMessages(reqQuery: any): Promise<IMessage[] | null> {
    throw new Error('Method not implemented.');
  }

  getMessageById(id: string): Promise<IMessage | null> {
    return this.messageDao.getOneById(id);
  }
  getMessagesByChatId(chatId: string): Promise<IMessage[] | null> {
    return this.messageDao.getMany({ chatId });
  }

  deleteMessage(messageId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  async getChatById(id: string) {
    return await this.chatDao.getOneByIdPopulate(id, { path: 'messages' }, '', false);
  }

  async getChatsByUserId(id: string) {
    return await this.chatDao.getMany({ $or: [{ user: id }, { tasker: id }] });
  }
}

export { MessageService };
