export enum UserType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserType;
  profilePicture: {
    url: string;
    publicId: string | null;
  };
  phoneNumber: string;
  active: boolean;
  location: {
    type: {
      enum: ['Point'];
      default: 'Point';
    };
    coordinates: [number, number];
  };
  country: string;
  city: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IClient {
  _id?: string; // client id
  userId: string; // user id
}

export interface ITasker {
  _id?: string; // tasker id
  userId: string; // user id
  rating: number; // average of reviews
  bio: string;
  completedTasks: number;
  services: string[];
}

export interface IUserRole {}
