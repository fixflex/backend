"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatDao = void 0;
const chat_model_1 = require("../models/chat.model");
const baseDao_1 = __importDefault(require("./baseDao"));
class ChatDao extends baseDao_1.default {
    constructor() {
        super(chat_model_1.ChatModel);
    }
}
exports.ChatDao = ChatDao;
