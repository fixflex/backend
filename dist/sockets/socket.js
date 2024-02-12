"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
// import Error
const middleware_1 = require("../middleware");
class SocketService {
    constructor(httpServer) {
        this.httpServer = httpServer;
        this.io = new socket_io_1.Server(this.httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });
        this.initializeSocket();
    }
    initializeSocket() {
        this.io.use(async (socket, next) => {
            try {
                (0, cookie_parser_1.default)()(socket.request, {}, () => { });
                if (socket.request.user)
                    socket.request.user = null;
                await (0, middleware_1.authenticateUser)(socket.request, {}, next);
                if (!socket.request.user) {
                    next(new Error('Authentication error'));
                }
            }
            catch (error) {
                console.log(error);
            }
        });
        this.io.on('connection', (socket) => {
            if (!socket.request.user)
                socket.disconnect();
            console.log('User connected', socket.id);
            // console.log(socket.request.user);
            socket.on('message', data => {
                console.log(data);
                console.log(socket.id);
                socket.broadcast.emit('message', data);
            });
            socket.on('joinMyRoom', room => {
                // console.log('User joined room:', room);
                socket.join(room);
            });
            socket.on('disconnect', () => {
                console.log('User disconnected from socket:', socket.id);
            });
            socket.on('error', (error) => {
                console.log('Socket error:', error);
            });
        });
        this.io.on('error', (error) => {
            console.log('Socket error:', error);
        });
    }
    static getInstance(httpServer) {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService(httpServer);
        }
        return SocketService.instance;
    }
    getConnectedUsers() {
        return Object.keys(this.io.sockets.sockets).length;
    }
    getSocketIO() {
        return this.io;
    }
    closeSocket() {
        this.io.close();
    }
}
exports.SocketService = SocketService;
// import http from 'http';
// // import jwt, { JwtPayload } from 'jsonwebtoken';
// import { Server } from 'socket.io';
// import { ChatModel } from '../DB/models/chat.model';
// import { MessageModel } from '../DB/models/message.model';
// import { IMessage } from '../interfaces/message.interface';
// // import { ChatModel } from '../DB/models/chat/chat.model';
// // import { MessageModel } from '../DB/models/chat/message.model';
// // import env from '../config/validateEnv';
// import { Socket } from '../interfaces/socket.interface';
// // this will make the class a singleton class this means that we can use only one instance of the class in the whole app, that because the socket class should be a singleton class because we need to use the same instance of the class in all the files that we want to use the socket in it and if we use multiple instances of the class in the app this will cause a problem because if you emit an event from one instance of the class it will not be emitted to the other instances of the class and if you listen to an event in one instance of the class it will not be listened to in the other instances of the class.
// class SocketService {
//   private io: Server;
//   constructor(private httpServer: http.Server) {
//     this.io = new Server(this.httpServer, {
//       // add options here
//       // timeout: 10000,
//       // pingTimeout: 30000, // this is the time to wait for the pong response before disconnecting the client
//       // pingInterval: 30000, // this is the interval to send ping to the client
//       cors: {
//         origin: '*',
//         methods: ['GET', 'POST'],
//       },
//     });
//     this.initializeSocket();
//   }
//   private initializeSocket() {
//     // check if the user is authenticated and get the user id from the token and add it to the socket
//     // this.io.use((socket: Socket, next) => {
//     //   const token = socket.handshake.auth.token;
//     //   if (!token) {
//     //     return next(new Error('Authentication error'));
//     //   }
//     //   const decoded = jwt.verify(token, env.JWT_SECRET_KEY) as JwtPayload;
//     //   socket.userId = decoded.userId;
//     //   next();
//     // });
//     this.io.on('connection', (socket: Socket) => {
//       console.log('User connected ', socket.id);
//       socket.on('message', async (data: IMessage) => {
//         try {
//           console.log(data);
//           // TODO
//           let chatRoom = await ChatModel.findById(data.chatId);
//           // if !chatRoom throw error
//           if (!chatRoom) throw new Error('Chat room not found');
//           // if chatRoom.participants doesn't include the sender throw error
//           if (chatRoom.client !== data.sender && chatRoom.tasker !== data.sender)
//             throw new Error('You are not a participant in this chat room');
//           let message = await MessageModel.create(data);
//           if (!message) throw new Error('Message not created');
//           // push the message id to the messages array in the chat room and save it
//           chatRoom.messages.push(message._id);
//           await chatRoom.save();
//           // emit the message to the tasker in the chat room
//           // broadcast to all clients in the chat room except the sender
//           socket.broadcast.to(data.chatId!).emit('message', data);
//           // emit to all clients in the chat room
//           // this.io.to(data.chatId!).emit('message', data);
//         } catch (error: any) {
//           socket.emit('error', { message: error.message });
//         }
//       });
//       // join user to chat room
//       socket.on('join', async (chatId: string) => {
//         try {
//           // TODO
//           // check if the user is a participant in the chat room
//           let chatRoom = await ChatModel.findById(chatId);
//           // if !chatRoom throw error
//           if (!chatRoom) throw new Error('Chat room not found');
//           // if chatRoom.participants doesn't include the sender throw error
//           // if (chatRoom.client !== socket.userId && chatRoom.tasker !== socket.userId) throw new Error('You are not a participant in this chat room');
//           socket.join(chatId);
//         } catch (error: any) {
//           console.log(error);
//           socket.emit('error', { message: error.message });
//         }
//       });
//       // socket.on('disconnect', () => {});
//     });
//     // get connected users each 30 seconds
//   }
//   // reutrn number of connected users
//   public getConnectedUsers() {
//     return Object.keys(this.io.sockets.sockets).length;
//   }
//   public getSocketIO(): Server {
//     return this.io;
//   }
// }
// export { SocketService };
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
//  =================>> socket.io <<================= //
// socket.emit : emit to the sender only (private)
// socket.broadcast.emit : emit to all clients except the sender
// io.emit : emit to all clients in the chat room or namespace
// socket.join(chatId) : join the user to the chat room
// socket.leave(chatId) : leave the chat room
// io.to(chatId).emit : emit to all clients in the chat room
// socket.broadcast.to(chatId).emit : emit to all clients in the chat room except the sender
// socket.on('message', data => {}) : listen to the message event from the client
// socket.on('disconnect', () => {}) : listen to the disconnect event from the client
// io.of('/chat').emit : emit to all clients in the chat namespace
// io.of('/chat').to(chatId).emit : emit to all clients in the chat room in the chat namespace
// the actions that the only the server can do with the socket (single client connection) are:
// 1- emit to the client => socket.emit('event', data)
// 2- listen to the client => socket.on('event', data => {})
// 3- join the client to a room => socket.join('roomName')
// 4- leave the client from a room => socket.leave('roomName')
// 5- disconnect the client => socket.disconnect()
// 6- get the client id => socket.id
// 7- get the client rooms => socket.rooms
// 8- get the client handshake => socket.handshake
// 9- get the client namespace => socket.nsp
// 10- get the client adapter => socket.adapter
// 11- get the client server => socket.server
// 12- get the client request => socket.request
// 13- get the client conn => socket.conn
// 14- get the client data => socket.data
// 15- get the client event names => socket.eventNames()
// 16- get the client listener count => socket.listenerCount('event')
// 17- get the client listeners => socket.listeners('event')
// 18- get the client max listeners => socket.getMaxListeners()
// 19- get the client connected => socket.connected
// 20- get the client disconnected => socket.disconnected
// 21- get the client rooms count => socket.rooms.size
// the actions that the only the server can do with the io (server connection) are:
// 1- emit to all clients => io.emit('event', data)
// 2- listen to all clients => io.on('event', data => {})
// 3- get all connected clients => io.sockets.sockets
// 4- get all connected clients count => io.sockets.sockets.length
// 5- get all connected clients ids => Object.keys(io.sockets.sockets)
// 6- get all connected clients in a room => io.sockets.adapter.rooms.get('roomName')
// 7- get all connected clients in a room count => io.sockets.adapter.rooms.get('roomName').size
// 8- get all connected clients in a room ids => Object.keys(io.sockets.adapter.rooms.get('roomName'))
// 9- get all connected clients in a room sockets => io.sockets.adapter.rooms.get('roomName').sockets
// 10- get all connected clients in a room sockets count => io.sockets.adapter.rooms.get('roomName').sockets.size
// 11- get all connected clients in a room sockets ids => Object.keys(io.sockets.adapter.rooms.get('roomName').sockets)
// the actions that the server can do with the socket and the io are:
// 1- emit to all clients in a room => io.to('roomName').emit('event', data)
// 2- emit to all clients in a room except the sender => socket.broadcast.to('roomName').emit('event', data)
// 3- emit to all clients in a namespace => io.of('namespace').emit('event', data)
// 4- emit to all clients in a room in a namespace => io.of('namespace').to('roomName').emit('event', data)
// 5- emit to all clients in a room in a namespace except the sender => socket.broadcast.to('roomName').emit('event', data)
// 6- listen to all clients in a namespace => io.of('namespace').on('event', data => {})
// 7- get all connected clients in a namespace => io.of('namespace').sockets
// 8- get all connected clients in a namespace count => io.of('namespace').sockets.length
// 9- get all connected clients in a namespace ids => Object.keys(io.of('namespace').sockets)
// 10- get all connected clients in a namespace in a room => io.of('namespace').adapter.rooms.get('roomName')
// 11- get all connected clients in a namespace in a room count => io.of('namespace').adapter.rooms.get('roomName').size
// 12- get all connected clients in a namespace in a room ids => Object.keys(io.of('namespace').adapter.rooms.get('roomName'))
// 13- get all connected clients in a namespace in a room sockets => io.of('namespace').adapter.rooms.get('roomName').sockets
// 14- get all connected clients in a namespace in a room sockets count => io.of('namespace').adapter.rooms.get('roomName').sockets.size
// 15- get all connected clients in a namespace in a room sockets ids => Object.keys(io.of('namespace').adapter.rooms.get('roomName').sockets)
// the actions that the client can do with the socket are:
// 1- emit to the server => socket.emit('event', data)
// 2- listen to the server => socket.on('event', data => {})
// 3- join the client to a room => socket.join('roomName')
// 4- leave the client from a room => socket.leave('roomName')
// 5- disconnect the client => socket.disconnect()
// 6- get the client id => socket.id
// 7- get the client rooms => socket.rooms
// 8- get the client handshake => socket.handshake
// 9- get the client namespace => socket.nsp
// 10- get the client adapter => socket.adapter
// 11- get the client server => socket.server
// 12- get the client request => socket.request
// 13- get the client conn => socket.conn
// 14- get the client data => socket.data
// 15- get the client event names => socket.eventNames()
