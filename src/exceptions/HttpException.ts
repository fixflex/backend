/** @description   this class is responsible about operational error (errors that can be predicted)*/
export default class HttpException extends Error {
  public statusCode;
  public status: string;
  public isOperational: boolean;
  path?: string;
  value?: string;
  code?: number;
  errors?: any;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
  }
}
