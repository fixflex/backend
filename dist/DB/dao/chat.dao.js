"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatDao = void 0;
const chat_model_1 = require("../models/chat.model");
class ChatDao {
    static async getChatById(id) {
        return await chat_model_1.ChatModel.findById(id).populate('messages');
    }
    static async getChatByUserId(id) {
        let chats = await chat_model_1.ChatModel.find({ $or: [{ client: id }, { tasker: id }] }, 'client tasker');
        // console.log(chats);
        return chats;
    }
    static async createChat(data) {
        return await chat_model_1.ChatModel.create(data);
    }
}
exports.ChatDao = ChatDao;
