import { ChatDao } from '../DB/dao/chat.dao';

class ChatService {
  async getChatById(id: string) {
    return await ChatDao.getChatById(id);
  }

  async getChatByUserId(id: string) {
    return await ChatDao.getChatByUserId(id);
  }

  async createChat(data: any) {
    return await ChatDao.createChat(data);
  }
}

export { ChatService };
