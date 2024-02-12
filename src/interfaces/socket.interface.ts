// socket interface for authentication
import { IncomingMessage } from 'http';
import { Socket as socketIo } from 'socket.io';

export interface Socket extends socketIo {
  request: IncomingMessage & {
    user?: any;
    cookies?: { [key: string]: string };
  };
}
