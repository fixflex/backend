import { Document, Schema, model } from 'mongoose';

import { IMessage } from '../../../interfaces/message.interface';

const messageSchema = new Schema<IMessage & Document>({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Chat = model<IMessage & Document>('Chat', messageSchema);

export default Chat;
