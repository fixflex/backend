import { ResponseT } from '../interfaces';

export const customResponse = <T>({ data, success, message }: ResponseT<T>) => {
  return {
    success,
    message,
    data,
  };
};

export default customResponse;
