import { Document, Schema, model } from 'mongoose';

import { IChat } from '../../interfaces/chat.interface';

const chatSchema = new Schema<IChat & Document>(
  {
    user: { type: String, ref: 'User', required: true },
    tasker: { type: String, ref: 'User', required: true },
    messages: [{ type: String, ref: 'Message' }],
  },
  { timestamps: true }
);

const ChatModel = model<IChat & Document>('Chat', chatSchema);

export { ChatModel };
