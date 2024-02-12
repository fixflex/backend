import { autoInjectable } from 'tsyringe';

import { io } from '..';
import { ChatDao } from '../DB/dao/chat.dao';
import HttpException from '../exceptions/HttpException';
import { IChat, IChatService, IUser } from '../interfaces';

@autoInjectable()
class ChatService implements IChatService {
  constructor(private chatDao: ChatDao) {}
  async getChatById(id: string) {
    return await ChatDao.getChatById(id);
  }

  async getChatByUserId(id: string) {
    return await ChatDao.getChatByUserId(id);
  }

  async createChat(data: IChat, user: IUser) {
    // 1. check that the user and tasker are not the same && that they exist && user === req.user._id
    if (data.user === data.tasker) throw new HttpException(400, 'User and tasker cannot be the same');
    if (data.user !== user._id) throw new HttpException(403, 'Unauthorized');
    // 2. check if chat already  exists
    let chat = await this.chatDao.getOne({ user: data.user, tasker: data.tasker });
    if (chat) return chat;
    // 3. create chat and return it
    let newChat = await this.chatDao.create(data);
    // make user and tasker join the chat room where the room name is the newChat._id
    io.to(newChat.user).emit('newChatRoom', newChat);
    io.to(newChat.tasker).emit('newChatRoom', newChat);

    return newChat;
  }
}

export { ChatService };
