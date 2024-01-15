export interface ITasker {
  _id?: string; // tasker id
  userId: string; // user id
  rating: number; // average of reviews
  bio: string;
  completedTasks: number;
  services: string[];
  phoneNumber: string;
  location: {
    type: {
      type: string;
      enum: ['Point'];
      default: 'Point';
    };
    coordinates: [number, number];
  };
}
