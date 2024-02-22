"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatDao = void 0;
const chat_model_1 = require("../models/chat.model");
const base_dao_1 = __importDefault(require("./base.dao"));
class ChatDao extends base_dao_1.default {
    constructor() {
        super(chat_model_1.ChatModel);
    }
}
exports.ChatDao = ChatDao;
