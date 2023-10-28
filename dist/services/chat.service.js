"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const chat_dao_1 = require("../DB/dao/chat.dao");
class ChatService {
    async getChatById(id) {
        return await chat_dao_1.ChatDao.getChatById(id);
    }
    async getChatByUserId(id) {
        return await chat_dao_1.ChatDao.getChatByUserId(id);
    }
    async createChat(data) {
        return await chat_dao_1.ChatDao.createChat(data);
    }
}
exports.ChatService = ChatService;
