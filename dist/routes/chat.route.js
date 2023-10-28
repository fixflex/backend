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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoute = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const chat_controller_1 = require("../controllers/chat.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const chat_validator_1 = require("../middleware/validation/chat.validator");
const isMongoID_validator_1 = require("../middleware/validation/isMongoID.validator");
let ChatRoute = class ChatRoute {
    constructor(chatController) {
        this.chatController = chatController;
        this.path = '/chats';
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        //  protected routes
        this.router.use(`${this.path}`, auth_middleware_1.authenticateUser);
        this.router.post(`${this.path}`, chat_validator_1.createChatValidator, this.chatController.createChat);
        // get chat for logged in user
        this.router.get(`${this.path}`, this.chatController.getChatByUserId);
        this.router.get(`${this.path}/:id`, isMongoID_validator_1.isMongoId, this.chatController.getChatById);
    }
};
exports.ChatRoute = ChatRoute;
exports.ChatRoute = ChatRoute = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [chat_controller_1.ChatController])
], ChatRoute);
