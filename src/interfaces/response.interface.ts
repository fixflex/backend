export interface ResponseT<T = null> {
  data: T;
  success: boolean;
  error: boolean;
  message: string | null;
  status: number;
}

export default ResponseT;
