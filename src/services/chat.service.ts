import { autoInjectable } from 'tsyringe';

import { io } from '..';
import { ChatDao } from '../DB/dao/chat.dao';
import HttpException from '../exceptions/HttpException';
import { IChat, IChatService, IUser } from '../interfaces';

@autoInjectable()
class ChatService implements IChatService {
  constructor(private chatDao: ChatDao) {}
  async getChatById(id: string) {
    return await this.chatDao.getOneByIdPopulate(id, { path: 'messages' }, '', false);
  }

  async getChatsByUserId(id: string) {
    return await this.chatDao.getMany({ $or: [{ user: id }, { tasker: id }] });
  }

  async createChat(data: IChat, user: IUser) {
    // 1. set data.user to user._id
    data.user = user._id.toString();
    // 2. check that the user and tasker are not the same
    if (data.user === data.tasker) throw new HttpException(400, 'User and tasker cannot be the same');
    // 3. check if chat already  exists
    let chat = await this.chatDao.getOne({ user: data.user, tasker: data.tasker });
    if (chat) return chat;
    // 4. create chat and return it
    let newChat = await this.chatDao.create(data);
    // make user and tasker join the chat room where the room name is the newChat._id
    io.to(newChat.user).emit('newChatRoom', newChat);
    console.log(newChat.user);
    io.to(newChat.tasker).emit('newChatRoom', newChat);

    return newChat;
  }
}

export { ChatService };
