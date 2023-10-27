import http from 'http';
// import jwt, { JwtPayload } from 'jsonwebtoken';
import { Server } from 'socket.io';

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
    try {
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
        console.log('User connected ', socket.id);

        this.io.on('message', data => {
          console.log(socket.userId, data);
        });
      });

      // get connected users each 30 seconds
    } catch (error) {
      console.log(error);
    }
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
