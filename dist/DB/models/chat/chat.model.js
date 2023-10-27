"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = void 0;
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    client: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    tasker: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    messages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Message' }],
});
const ChatModel = (0, mongoose_1.model)('Chat', chatSchema);
exports.ChatModel = ChatModel;
