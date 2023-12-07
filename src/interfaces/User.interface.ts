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
  passwordChangedAt: Date;
  passwordResetCode: string | undefined;
  passwordResetCodeExpiration: number | undefined;
  passwordResetVerified: boolean | undefined;
  role: UserType;
  profilePicture: {
    url: string | null;
    publicId: string | null;
  };
  active: boolean;
  // ip address of the user when he registered or logged in
  ipAddress: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IClient {
  _id?: string; // client id
  userId: string; // user id
  location: {
    type: {
      enum: ['Point'];
      default: 'Point';
    };
    coordinates: [number, number];
  };
}

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

// export interface IUserRole {}
