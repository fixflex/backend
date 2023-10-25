"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    client: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    tasker: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    messages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Message' }],
});
const Chat = (0, mongoose_1.model)('Chat', chatSchema);
exports.default = Chat;
