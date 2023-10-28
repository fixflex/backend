"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatDao = void 0;
const chat_model_1 = require("../models/chat/chat.model");
class ChatDao {
    static async getChatById(id) {
        return await chat_model_1.ChatModel.findById(id).populate('messages');
    }
    static async getChatByUserId(id) {
        return await chat_model_1.ChatModel.find({ $or: [{ client: id }, { tasker: id }] }, 'client tasker');
    }
    static async createChat(data) {
        return await chat_model_1.ChatModel.create(data);
    }
}
exports.ChatDao = ChatDao;
