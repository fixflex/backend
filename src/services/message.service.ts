import { autoInjectable } from 'tsyringe';

import { io } from '..';
import { MessageDao } from '../DB/dao';
import { ChatDao } from '../DB/dao/chat.dao';
import HttpException from '../exceptions/HttpException';
import { IMessage, IMessageService, IUser } from '../interfaces';

@autoInjectable()
class MessageService implements IMessageService {
  constructor(private chatDao: ChatDao, private messageDao: MessageDao) {}

  async createMessage(data: IMessage, user: IUser) {
    data.sender = user._id.toString();
    // 1. check if chat exists
    let chat = await this.chatDao.getOneById(data.chatId);
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

  async getMessagesByChatId(chatId: string, user: IUser) {
    // 1. check if chat exists
    let chat = await this.chatDao.getOneById(chatId);
    if (!chat) throw new HttpException(404, 'Chat not found');
    // 2. check if user is part of the chat
    if (chat.user !== user._id.toString() && chat.tasker !== user._id.toString())
      throw new HttpException(403, 'You are not part of this chat');
    // 3. get messages by chat id
    return this.messageDao.getMany({ chatId });
  }

  async deleteMessage(messageId: string, user: IUser) {
    // 1. check if message exists
    let message = await this.messageDao.getOneById(messageId);
    if (!message) throw new HttpException(404, 'Message not found');
    // 2. check if user is the sender of the message
    if (message.sender !== user._id.toString()) throw new HttpException(403, 'You are not allowed to delete this message');
    // 3. delete message
    return this.messageDao.deleteOneById(messageId);
  }
}

export { MessageService };
