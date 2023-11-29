export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface ITask {
  _id?: number;
  ownerId: string;
  dueDate: {
    start: Date;
    end: Date;
    flxible: boolean;
  };
  title: string;
  details: string;
  images: {
    url: string;
    publicId: string | null;
  }[];
  service: string;
  status: TaskStatus;
  location: {
    type: {
      enum: ['Point'];
      default: 'Point';
    };
    coordinates: [number, number];
  };
  city: string;
  budget: number;
  offer: string;
  createdAt?: string;
  updatedAt?: string;
}
