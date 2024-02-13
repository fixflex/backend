"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const tsyringe_1 = require("tsyringe");
const __1 = require("..");
const chat_dao_1 = require("../DB/dao/chat.dao");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
let ChatService = class ChatService {
    constructor(chatDao) {
        this.chatDao = chatDao;
    }
    async getChatById(id) {
        return await this.chatDao.getOneByIdPopulate(id, { path: 'messages' }, '', false);
    }
    async getChatsByUserId(id) {
        return await this.chatDao.getMany({ $or: [{ user: id }, { tasker: id }] });
    }
    async createChat(data, user) {
        // 1. set data.user to user._id
        data.user = user._id.toString();
        // 2. check that the user and tasker are not the same
        if (data.user === data.tasker)
            throw new HttpException_1.default(400, 'User and tasker cannot be the same');
        // 3. check if chat already  exists
        let chat = await this.chatDao.getOne({ user: data.user, tasker: data.tasker });
        if (chat)
            return chat;
        // 4. create chat and return it
        let newChat = await this.chatDao.create(data);
        // make user and tasker join the chat room where the room name is the newChat._id
        __1.io.to(newChat.user).emit('newChatRoom', newChat);
        console.log(newChat.user);
        __1.io.to(newChat.tasker).emit('newChatRoom', newChat);
        return newChat;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [chat_dao_1.ChatDao])
], ChatService);
