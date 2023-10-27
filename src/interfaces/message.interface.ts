export interface IMessage {
  _id?: string;
  sender: string; // ref: User
  message: string;
  chatId?: string;
  createdAt: Date;
}
