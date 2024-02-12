import { IChat } from '../../interfaces';
import { ChatModel } from '../models/chat.model';
import BaseDao from './baseDao';

class ChatDao extends BaseDao<IChat> {
  constructor() {
    super(ChatModel);
  }
  // static async getChatById(id: string) {
  //   return await ChatModel.findById(id).populate('messages');
  // }

  // static async getChatByUserId(id: string) {
  //   let chats = await ChatModel.find({ $or: [{ client: id }, { tasker: id }] }, 'client tasker');

  //   // console.log(chats);
  //   return chats;
  // }

  // static async createChat(data: any) {
  //   return await ChatModel.create(data);
  // }
}

export { ChatDao };
