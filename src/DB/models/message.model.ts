import { Document, Schema, model } from 'mongoose';

import { IMessage } from '../../interfaces/message.interface';

const messageSchema = new Schema<IMessage & Document>({
  sender: { type: String, ref: 'User', required: true },
  message: { type: String, required: true },
  chatId: { type: String, ref: 'Chat', required: true },
  createdAt: { type: Date, default: Date.now },
});

const MessageModel = model<IMessage & Document>('Message', messageSchema);

export { MessageModel };
