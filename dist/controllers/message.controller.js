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
exports.MessageController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const tsyringe_1 = require("tsyringe");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const customResponse_1 = __importDefault(require("../helpers/customResponse"));
const services_1 = require("../services");
let MessageController = class MessageController {
    constructor(messageService) {
        this.messageService = messageService;
        this.createMessage = (0, express_async_handler_1.default)(async (req, res) => {
            const message = await this.messageService.createMessage(req.body, req.user);
            res.status(201).json((0, customResponse_1.default)({ data: message, success: true, message: 'Message created' }));
        });
        this.getMessagesByChatId = (0, express_async_handler_1.default)(async (req, res) => {
            let messages = await this.messageService.getMessagesByChatId(req.params.id, req.user);
            if (!messages)
                throw new HttpException_1.default(404, 'No chat found');
            res.status(200).json({ results: messages.length, data: messages });
        });
        this.deleteMessage = (0, express_async_handler_1.default)(async (req, res) => {
            let message = await this.messageService.deleteMessage(req.params.id, req.user);
            if (!message)
                throw new HttpException_1.default(404, 'No chat found');
            res.status(200).json((0, customResponse_1.default)({ data: message, success: true, message: 'Message deleted' }));
        });
    }
};
exports.MessageController = MessageController;
exports.MessageController = MessageController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [services_1.MessageService])
], MessageController);
