import { ResponseT } from '.';

export interface ErrorResponse extends ResponseT {
  stack?: string;
}
