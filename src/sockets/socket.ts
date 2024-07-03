import { createAdapter } from '@socket.io/redis-adapter';
import cookieParser from 'cookie-parser';
import { NextFunction } from 'express';
import http from 'http';
import { Redis } from 'ioredis';
import { Server } from 'socket.io';

import { ChatDao } from '../DB/dao';
import env from '../config/validateEnv';
import { Request, Response } from '../helpers';
import { Socket } from '../interfaces/socket.interface';
import { authenticateUser } from '../middleware';

class SocketService {
  private static instance: SocketService;

  private io: Server;

  private pubClient = new Redis(env.REDIS_URL);

  private subClient = this.pubClient.duplicate();

  private constructor(private httpServer: http.Server) {
    this.io = new Server(this.httpServer, {
      // add options here
      // pingTimeout: 30000, // this is the time to wait for the pong response before disconnecting the client 30 seconds
      cors: {
        // TODO: change this to the client url in production
        // origin: NODE_ENV === 'production' ? 'https://fixflex.com' : '*',
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      adapter: createAdapter(this.pubClient, this.subClient),
    });
    this.initializeSocket();
  }
  private initializeSocket() {
    try {
      this.io.use(async (socket: Socket, next) => {
        try {
          cookieParser()(socket.request as Request, {} as Response, () => {});

          if (socket.request.user) socket.request.user = null;

          await authenticateUser(socket.request as Request, {} as Response, next as NextFunction);
          if (!socket.request.user) {
            return next(new Error('Authentication error'));
          }
          // change the user id to string
          socket.request.user._id = socket.request.user._id.toString();
        } catch (error: any) {
          console.log(error);
        }
      });

      this.io.on('connection', (socket: Socket) => {
        try {
          if (!socket.request.user) socket.disconnect();
          // console.log('User connected', socket.id);
          // console.log(socket.request.user);

          // socket.on('message', data => {
          //   console.log(data);
          //   console.log(socket.id);
          //   socket.broadcast.emit('message', data);
          // });

          socket.on('joinMyRoom', _ => {
            try {
              console.log('User joined his room:', socket.request.user._id, socket.request.user.lastName);
              socket.join(socket.request.user._id);
              // emit event to the user when he join his room
              socket.emit(socket.request.user._id, { message: 'Welcome to your room' });
            } catch (error) {
              console.log(error);
            }
          });

          // handle the message event
          // socket.on('message', async (data: any) => {
          //   try {
          //     // check if the user is a participant in the chat room and the chat room exists
          //     let chatRoom = await new ChatDao().getOneById(data.chatId);
          //     if (!chatRoom) return socket.emit('error', { message: 'Chat room not found' });
          //     if (chatRoom.user !== socket.request.user._id && chatRoom.tasker !== socket.request.user._id)
          //       return socket.emit('error', { message: 'You are not a participant in this chat room' });
          //     // emit the message to the tasker in the chat room
          //     // broadcast to all clients in the chat room except the sender
          //     socket.broadcast.to(data.chatId).emit('message', data);
          //   } catch (error: any) {
          //     console.log(error);
          //     socket.emit('error', { message: error.message });
          //   }
          // });

          socket.on('joinChatRoom', async room => {
            console.log('User joined chat room:', room);
            // check if the user is a participant in the chat room and the chat room exists
            let chatRoom = await new ChatDao().getOneById(room);
            // console.log(chatRoom);
            if (!chatRoom) return socket.emit('error', { message: 'Chat room not found' });
            if (chatRoom.user !== socket.request.user._id && chatRoom.tasker !== socket.request.user._id)
              return socket.emit('error', { message: 'You are not a participant in this chat room' });
            console.log(`User ${socket.request.user._id} joined chat room:`, room);
            socket.join(room);
          });

          socket.on('disconnect', () => {
            console.log('User disconnected from socket:', socket.id);
          });

          socket.on('error', (error: Error) => {
            console.log('Socket error:', error);
          });
        } catch (error: any) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  public static getInstance(httpServer: http.Server): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService(httpServer);
    }
    return SocketService.instance;
  }

  public getConnectedUsers(): number {
    return Object.keys(this.io.sockets.sockets).length;
  }

  public getSocketIO(): Server {
    return this.io;
  }

  public closeSocket(): void {
    this.io.close();
  }
}

export { SocketService };
