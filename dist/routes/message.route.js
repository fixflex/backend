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
exports.MessageRoute = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const controllers_1 = require("../controllers");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_1 = require("../middleware/validation");
const isMongoID_validator_1 = require("../middleware/validation/isMongoID.validator");
let MessageRoute = class MessageRoute {
    constructor(messageController) {
        this.messageController = messageController;
        this.path = '/messages';
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        //  protected routes
        this.router.use(`${this.path}`, auth_middleware_1.authenticateUser);
        this.router.post(`${this.path}`, validation_1.createMessageValidator, this.messageController.createMessage);
        // get chat for logged in user
        // this.router.get(`${this.path}`, this.messageController.getMessages);
        // this.router.get(`${this.path}/:id`, isMongoId, this.messageController.getMessageById);
        this.router.get(`${this.path}/chat/:id`, isMongoID_validator_1.isMongoId, this.messageController.getMessagesByChatId);
        this.router.delete(`${this.path}/:id`, isMongoID_validator_1.isMongoId, this.messageController.deleteMessage);
    }
};
exports.MessageRoute = MessageRoute;
exports.MessageRoute = MessageRoute = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [controllers_1.MessageController])
], MessageRoute);
