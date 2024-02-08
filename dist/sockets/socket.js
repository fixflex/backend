"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
// import jwt, { JwtPayload } from 'jsonwebtoken';
const socket_io_1 = require("socket.io");
const chat_model_1 = require("../DB/models/chat.model");
const message_model_1 = require("../DB/models/message.model");
class SocketService {
    constructor(httpServer) {
        this.httpServer = httpServer;
        this.io = new socket_io_1.Server(this.httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });
    }
    initializeSocket() {
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
        this.io.on('connection', (socket) => {
            console.log('User connected ', socket.id);
            socket.on('message', async (data) => {
                try {
                    console.log(data);
                    // TODO
                    let chatRoom = await chat_model_1.ChatModel.findById(data.chatId);
                    // if !chatRoom throw error
                    if (!chatRoom)
                        throw new Error('Chat room not found');
                    // if chatRoom.participants doesn't include the sender throw error
                    if (chatRoom.client !== data.sender && chatRoom.tasker !== data.sender)
                        throw new Error('You are not a participant in this chat room');
                    let message = await message_model_1.MessageModel.create(data);
                    if (!message)
                        throw new Error('Message not created');
                    // push the message id to the messages array in the chat room and save it
                    chatRoom.messages.push(message._id);
                    await chatRoom.save();
                    // emit the message to the tasker in the chat room
                    // broadcast to all clients in the chat room except the sender
                    socket.broadcast.to(data.chatId).emit('message', data);
                    // emit to all clients in the chat room
                    // this.io.to(data.chatId!).emit('message', data);
                }
                catch (error) {
                    socket.emit('error', { message: error.message });
                }
            });
            // join user to chat room
            socket.on('join', async (chatId) => {
                try {
                    // TODO
                    // check if the user is a participant in the chat room
                    let chatRoom = await chat_model_1.ChatModel.findById(chatId);
                    // if !chatRoom throw error
                    if (!chatRoom)
                        throw new Error('Chat room not found');
                    // if chatRoom.participants doesn't include the sender throw error
                    // if (chatRoom.client !== socket.userId && chatRoom.tasker !== socket.userId) throw new Error('You are not a participant in this chat room');
                    socket.join(chatId);
                }
                catch (error) {
                    console.log(error);
                    socket.emit('error', { message: error.message });
                }
            });
            // socket.on('disconnect', () => {});
        });
        // get connected users each 30 seconds
    }
    // reutrn number of connected users
    getConnectedUsers() {
        return Object.keys(this.io.sockets.sockets).length;
    }
    getSocketIO() {
        return this.io;
    }
}
exports.SocketService = SocketService;
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
// 1 socket is the connection between the client and the server
// 2 the server can have multiple sockets
// 3 the server can emit events to the client using the socket
// 4 the client can emit events to the server using the socket
// 5 the server can listen to events from the client using the socket
// 6 the client can listen to events from the server using the socket
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
