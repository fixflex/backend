"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = void 0;
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    user: { type: String, ref: 'User', required: true },
    tasker: { type: String, ref: 'User', required: true },
    messages: [{ type: String, ref: 'Message' }],
});
const ChatModel = (0, mongoose_1.model)('Chat', chatSchema);
exports.ChatModel = ChatModel;
