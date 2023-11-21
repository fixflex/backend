export interface IService {
  _id?: string;
  name: string;
  description: string;
  image: {
    url: string;
    publicId: string | null;
  };
}
