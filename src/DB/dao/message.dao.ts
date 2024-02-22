import { IMessage } from '../../interfaces';
import { MessageModel } from '../models';
import BaseDao from './base.dao';

class MessageDao extends BaseDao<IMessage> {
  constructor() {
    super(MessageModel);
  }
  //   static async getChatById(id: string) {
  //     return await MessageModel.findById(id).populate('messages');
  //   }

  //   static async getChatByUserId(id: string) {
  //     let chats = await MessageModel.find({ $or: [{ client: id }, { tasker: id }] }, 'client tasker');

  //     // console.log(chats);
  //     return chats;
  //   }

  //   static async createChat(data: any) {
  //     return await MessageModel.create(data);
  //   }
}

export { MessageDao };
