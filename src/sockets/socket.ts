import http from 'http';
// import jwt, { JwtPayload } from 'jsonwebtoken';
import { Server } from 'socket.io';

import { ChatModel } from '../DB/models/chat/chat.model';
import { MessageModel } from '../DB/models/chat/message.model';
import { IMessage } from '../interfaces/message.interface';
// import { ChatModel } from '../DB/models/chat/chat.model';
// import { MessageModel } from '../DB/models/chat/message.model';
// import env from '../config/validateEnv';
import { AuthSocket } from '../interfaces/socket.interface';

class SocketService {
  private io: Server;

  constructor(private httpServer: http.Server) {
    this.io = new Server(this.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
  }

  public initializeSocket() {
    // check if the user is authenticated and get the user id from the token and add it to the socket
    // this.io.use((socket: AuthSocket, next) => {
    //   const token = socket.handshake.auth.token;
    //   if (!token) {
    //     return next(new Error('Authentication error'));
    //   }
    //   const decoded = jwt.verify(token, env.JWT_SECRET_KEY) as JwtPayload;
    //   socket.userId = decoded.userId;
    //   next();
    // });

    this.io.on('connection', (socket: AuthSocket) => {
      socket.on('message', async (data: IMessage) => {
        try {
          // TODO
          console.log(data.message);
          let chatRoom = await ChatModel.findById(data.chatId);
          // if !chatRoom throw error
          if (!chatRoom) throw new Error('Chat room not found');
          // if chatRoom.participants doesn't include the sender throw error
          if (chatRoom.client !== data.sender && chatRoom.tasker !== data.sender) throw new Error('You are not a participant in this chat room');

          let message = await MessageModel.create(data);
          if (!message) throw new Error('Message not created');
          // push the message id to the messages array in the chat room and save it
          chatRoom.messages.push(message._id);
          await chatRoom.save();

          // emit the message to the tasker in the chat room
          // broadcast to all clients in the chat room except the sender
          socket.broadcast.to(data.chatId!).emit('message', data);
          // emit to all clients in the chat room
          // this.io.to(data.chatId!).emit('message', data);
        } catch (error: any) {
          console.log(error);
          socket.emit('error', { message: error.message });
        }
      });

      // join user to chat room
      socket.on('join', async (chatId: string) => {
        try {
          // TODO
          // check if the user is a participant in the chat room
          console.log(chatId, '###################################');
          let chatRoom = await ChatModel.findById(chatId);
          // if !chatRoom throw error
          if (!chatRoom) throw new Error('Chat room not found');
          // if chatRoom.participants doesn't include the sender throw error
          // if (chatRoom.client !== socket.userId && chatRoom.tasker !== socket.userId) throw new Error('You are not a participant in this chat room');

          socket.join(chatId);
        } catch (error: any) {
          console.log(error);
          socket.emit('error', { message: error.message });
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected from socket:', socket.id);
      });
    });

    // get connected users each 30 seconds
  }
  // reutrn number of connected users
  public getConnectedUsers() {
    return Object.keys(this.io.sockets.sockets).length;
  }

  public getSocketIO(): Server {
    return this.io;
  }
}

export default SocketService;

// console.log('User connected ', socket.id);

// socket.on('message', async data => {
//   console.log(data);
//   // emit the message to the client and the tasker in the chat room
//   // with the id of the chat room
//   this.io.to(data.chatId).emit('message', data); // emit to all clients in the chat room
//   // socket.broadcast.to(data.chatId).emit('message', data); // emit to all clients in the chat room except the sender
//   // save the message to the messages collection
//   let message = await MessageModel.create(data);
//   if (message) {
//     // push the message id to the messages array in the chat room

//     await ChatModel.findByIdAndUpdate(data.chatId, { $push: { messages: message._id } });
//   }
// });

// socket.on('disconnect', () => {
//   console.log('User disconnected from socket:', socket.id);
// });
