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
exports.ChatController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const tsyringe_1 = require("tsyringe");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const chat_service_1 = require("../services/chat.service");
const customResponse_1 = __importDefault(require("../utils/customResponse"));
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
        this.getChatById = (0, express_async_handler_1.default)(async (req, res) => {
            console.log('from chat controller');
            let chat = await this.chatService.getChatById(req.params.id);
            if (!chat)
                throw new HttpException_1.default(404, 'No chat found');
            res.status(200).json((0, customResponse_1.default)({ data: chat, success: true, status: 200, message: 'Chat found', error: false }));
        });
        this.getChatByUserId = (0, express_async_handler_1.default)(async (req, res) => {
            let chat = await this.chatService.getChatByUserId(req.user?._id);
            if (!chat)
                throw new HttpException_1.default(404, 'No chat found');
            res.status(200).json({ results: chat.length, data: chat });
        });
        this.createChat = (0, express_async_handler_1.default)(async (req, res) => {
            const chat = await this.chatService.createChat(req.body);
            res.status(201).json((0, customResponse_1.default)({ data: chat, success: true, status: 201, message: 'Chat created', error: false }));
        });
    }
};
exports.ChatController = ChatController;
exports.ChatController = ChatController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
