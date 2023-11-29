export interface IOffer {
  _id?: string;
  taskerId: string;
  taskId: string;
  message: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}
