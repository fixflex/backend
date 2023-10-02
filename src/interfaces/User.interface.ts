export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture: {
    url: string;
    publicId: string | null;
  };
  bio: string;
  role: string;
  active: boolean;
}
