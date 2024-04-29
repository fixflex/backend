import { ITask } from '../interfaces';

export class TaskDto {
  constructor(task: ITask) {
    this._id = task._id!;
    this.userId = task.userId;
    this.taskerId = task.taskerId;
    this.dueDate = task.dueDate;
    this.time = task.time;
    this.title = task.title;
    this.details = task.details;
    this.imageCover = task.imageCover;
    this.images = task.images;
    this.categoryId = task.categoryId;
    this.status = task.status;
    this.location = task.location;
    this.city = task.city;
    this.budget = task.budget;
    this.offersDetails = task.offers;
    this.acceptedOffer = task.acceptedOffer;
    this.createdAt = task.createdAt;
    this.updatedAt = task.updatedAt;
    this.paymentMethod = task.paymentMethod;
    this.paid = task.paid;
  }

  readonly _id: string;
  readonly userId: string;
  readonly taskerId: string | null;
  readonly dueDate: {
    on: Date;
    before: Date;
    flexible: boolean;
  };
  readonly time: any;
  readonly title: string;
  readonly details: string;
  readonly imageCover: {
    url: string;
    publicId: string | null;
  };
  readonly images: {
    url: string;
    publicId: string | null;
  }[];
  readonly categoryId: string;
  readonly status: string;
  readonly location: {
    type: {
      enum: ['Point'];
      default: 'Point';
    };
    coordinates: [number, number];
    online: boolean;
  };
  readonly city: string;
  readonly budget: number;
  readonly offersDetails: string[];
  readonly acceptedOffer: string | undefined;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly paymentMethod: string;
  readonly paid: boolean;
}
