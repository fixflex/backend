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
    return await this.chatDao.getMany({ $or: [{ user: id }, { tasker: id }] }, '-messages', false);
  }

  async createChat(data: IChat, user: IUser) {
    // 1. set data.user to user._id
    data.user = user._id.toString();
    // 2. check that the user and tasker are not the same
    if (data.user === data.tasker) throw new HttpException(400, 'User and tasker cannot be the same');
    // 3. check if chat already  exists wheither the user is the tasker or the user
    let chat = await this.chatDao.getOne({
      $or: [
        { user: data.user, tasker: data.tasker },
        { user: data.tasker, tasker: data.user },
      ],
    });
    if (chat) return chat;
    // 4. create chat and return it
    let newChat = await this.chatDao.create(data);
    // make user and tasker join the chat room where the room name is the newChat._id
    io.to(newChat.user).emit('newChatRoom', JSON.stringify(newChat, null, 2));
    io.to(newChat.tasker).emit('newChatRoom', JSON.stringify(newChat, null, 2));

    return newChat;
  }
}

export { ChatService };
