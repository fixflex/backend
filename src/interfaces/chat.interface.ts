import { ObjectId } from 'mongoose';

export interface IChat {
  _id: string;
  client: ObjectId; // ref: User
  tasker: ObjectId; // ref: User
  messages: string[];
}
