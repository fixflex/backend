import { Document, Schema, model } from 'mongoose';

import { IChat } from '../../interfaces/chat.interface';

const chatSchema = new Schema<IChat & Document>({
  client: { type: String, ref: 'User', required: true },
  tasker: { type: String, ref: 'User', required: true },
  messages: [{ type: String, ref: 'Message' }],
});

const ChatModel = model<IChat & Document>('Chat', chatSchema);

export { ChatModel };
