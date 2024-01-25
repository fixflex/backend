export interface ResponseT<T = null> {
  data: T;
  success: boolean;
  message: string | null;
}

export default ResponseT;
