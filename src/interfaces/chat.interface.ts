export interface IChat {
  _id: string;
  client: string; // ref: User
  tasker: string; // ref: User
  messages: string[];
}
