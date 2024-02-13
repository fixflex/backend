"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    sender: { type: String, ref: 'User', required: true },
    message: { type: String, required: true },
    chatId: { type: String, ref: 'Chat', required: true },
    createdAt: { type: Date, default: Date.now },
});
const MessageModel = (0, mongoose_1.model)('Message', messageSchema);
exports.MessageModel = MessageModel;
