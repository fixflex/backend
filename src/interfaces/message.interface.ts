import { ObjectId } from 'mongoose';

export interface IMessage {
  _id: string;
  sender: ObjectId; // ref: User
  message: string;
  createdAt: Date;
}
