import { Document, Schema, model } from 'mongoose';

import { IChat } from '../../../interfaces/chat.interface';

const chatSchema = new Schema<IChat & Document>({
  client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tasker: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
});

const ChatModel = model<IChat & Document>('Chat', chatSchema);

export { ChatModel };
