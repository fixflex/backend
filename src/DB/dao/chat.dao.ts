import { ChatModel } from '../models/chat/chat.model';

class ChatDao {
  static async getChatById(id: string) {
    return await ChatModel.findById(id).populate('messages');
  }

  static async createChat(data: any) {
    return await ChatModel.create(data);
  }
}

export { ChatDao };
