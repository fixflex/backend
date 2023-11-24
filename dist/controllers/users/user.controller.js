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
exports.UserController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const tsyringe_1 = require("tsyringe");
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const user_service_1 = require("../../services/users/user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
        // public Routes
        this.getUser = (0, express_async_handler_1.default)(async (req, res) => {
            let user = await this.userService.getUser(req.params.id);
            res.status(200).json({ data: user });
        });
        // user profile routes (authenticated)
        this.getMe = (0, express_async_handler_1.default)(async (req, res) => {
            let userData = {
                _id: req.user?._id,
                fullName: req.user?.firstName + ' ' + req.user?.lastName,
                email: req.user?.email,
                profilePicture: req.user?.profilePicture,
            };
            res.status(200).json({ data: userData });
        });
        this.updateMe = (0, express_async_handler_1.default)(async (req, res) => {
            let user = await this.userService.updateUser(req.user?._id, req.body);
            res.status(200).json({ data: user });
        });
        this.deleteMe = (0, express_async_handler_1.default)(async (req, res) => {
            await this.userService.deleteUser(req.user?._id);
            res.sendStatus(204);
        });
        this.updateMyProfileImage = (0, express_async_handler_1.default)(async (req, res, next) => {
            let userId = req.user?._id;
            if (!req.file)
                return next(new HttpException_1.default(400, 'Please upload a file'));
            let user = this.userService.updateProfileImage(userId, req.file);
            if (!user)
                return next(new HttpException_1.default(404, 'No user found'));
            res.status(200).json({ data: user });
        });
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
