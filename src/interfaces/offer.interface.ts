export interface IOffer {
  _id?: string;
  taskerId: string;
  taskId: string;
  message: string;
  // submessages are the messages that the tasker and the owner of the task send to each other in the offer
  subMessages: {
    sender: string;
    message: string;
  }[];
  images: {
    url: string;
    publicId: string | null;
  }[];
  createdAt?: string;
  updatedAt?: string;
}
