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
exports.MessageService = void 0;
const tsyringe_1 = require("tsyringe");
const __1 = require("..");
const dao_1 = require("../DB/dao");
const chat_dao_1 = require("../DB/dao/chat.dao");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
let MessageService = class MessageService {
    constructor(chatDao, messageDao) {
        this.chatDao = chatDao;
        this.messageDao = messageDao;
    }
    async createMessage(data, user) {
        data.sender = user._id.toString();
        // 1. check if chat exists
        let chat = await this.chatDao.getOneById(data.chatId);
        if (!chat)
            throw new HttpException_1.default(404, 'Chat not found');
        // 2. check if user is part of the chat
        if (chat.user !== user._id.toString() && chat.tasker !== user._id.toString())
            throw new HttpException_1.default(403, 'You are not part of this chat');
        // 3. create message
        let message = await this.messageDao.create(data);
        // 5. Push message to chat messages array
        await this.chatDao.updateOneById(chat._id, { $push: { messages: message._id } });
        // 6. emit message to chat room
        __1.io.to(chat._id.toString()).emit('message', message);
        // 7. return message
        return message;
    }
    async getMessagesByChatId(chatId, user) {
        // 1. check if chat exists
        let chat = await this.chatDao.getOneById(chatId);
        if (!chat)
            throw new HttpException_1.default(404, 'Chat not found');
        // 2. check if user is part of the chat
        if (chat.user !== user._id.toString() && chat.tasker !== user._id.toString())
            throw new HttpException_1.default(403, 'You are not part of this chat');
        // 3. get messages by chat id
        return this.messageDao.getMany({ chatId });
    }
    async deleteMessage(messageId, user) {
        // 1. check if message exists
        let message = await this.messageDao.getOneById(messageId);
        if (!message)
            throw new HttpException_1.default(404, 'Message not found');
        // 2. check if user is the sender of the message
        if (message.sender !== user._id.toString())
            throw new HttpException_1.default(403, 'You are not allowed to delete this message');
        // 3. delete message
        return this.messageDao.deleteOneById(messageId);
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [chat_dao_1.ChatDao, dao_1.MessageDao])
], MessageService);
