export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: {
    enum: ['client', 'tasker', 'admin'];
    default: 'client';
  };
  active: boolean;
}

export interface IAdmin extends IUser {}
export interface IClient extends IUser {
  profilePicture: {
    url: string;
    publicId: string | null;
  };
  bio: string;
  phoneNumber: string;
}

export interface ITasker extends IUser {
  profilePicture: {
    url: string;
    publicId: string | null;
  };
  bio: string;
  skills: string[];
  phoneNumber: string;
}
