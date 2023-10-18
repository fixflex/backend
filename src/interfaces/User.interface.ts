export interface IUser {
  _id?: string;
  firstName: {
    type: string;
    required: [true, 'First name is required'];
    trem: true;
  };
  lastName: string;

  email: string;
  password: string;
  role: {
    enum: ['client', 'tasker', 'admin'];
  };
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
  skills: string[];
  rating: number; // average of reviews
  bio: string;
}
