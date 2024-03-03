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
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const customResponse_1 = __importDefault(require("../helpers/customResponse"));
const uploadImages_middleware_1 = require("../middleware/uploadImages.middleware");
const user_service_1 = require("../services/user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
        // public Routes
        this.uploadProfileImage = (0, uploadImages_middleware_1.uploadSingleFile)('image');
        this.getUser = (0, express_async_handler_1.default)(async (req, res) => {
            let user = await this.userService.getUser(req.params.id);
            if (!user)
                throw new HttpException_1.default(404, 'user_not_found');
            // TODO: remove status from customResponse
            res.status(200).json((0, customResponse_1.default)({ data: user, success: true, message: req.t('user_found') }));
        });
        /**
         *  @desc    Get logged in user
         *  @route   GET /api/v1/auth/me
         *  @access  Private
         */
        this.getMe = (0, express_async_handler_1.default)(async (req, res) => {
            // console.log(req.headers);
            res.status(200).json((0, customResponse_1.default)({ data: req.user, success: true, message: req.t('user_found') }));
        });
        this.updateMe = (0, express_async_handler_1.default)(async (req, res) => {
            let user = await this.userService.updateUser(req.user?._id, req.body);
            if (!user)
                throw new HttpException_1.default(404, 'user_not_found');
            res.status(200).json((0, customResponse_1.default)({ data: user, success: true, message: req.t('user_updated') }));
        });
        this.deleteMe = (0, express_async_handler_1.default)(async (req, res) => {
            await this.userService.updateUser(req.user?._id, { active: false });
            res.status(204).json((0, customResponse_1.default)({ data: null, success: true, message: req.t('user_deleted') }));
        });
        this.updateMyProfileImage = (0, express_async_handler_1.default)(async (req, res, next) => {
            let userId = req.user?._id;
            if (!req.file)
                return next(new HttpException_1.default(400, 'image_required'));
            // console.log(req.file);
            let user = await this.userService.updateProfileImage(userId, req.file);
            if (!user)
                return next(new HttpException_1.default(404, 'No user found'));
            res.status(200).json((0, customResponse_1.default)({ data: user, success: true, message: req.t('user_updated') }));
        });
        this.sendVerificationCode = (0, express_async_handler_1.default)(async (req, res, next) => {
            let isSend = await this.userService.sendVerificationCode(req.user);
            if (!isSend)
                return next(new HttpException_1.default(500, 'something_went_wrong'));
            res.status(200).json((0, customResponse_1.default)({ data: null, success: true, message: req.t('verification_code_sent') }));
        });
        this.verifyCode = (0, express_async_handler_1.default)(async (req, res, next) => {
            let isVerified = await this.userService.verifyCode(req.user, req.body.verificationCode);
            if (!isVerified)
                return next(new HttpException_1.default(400, 'invalid_code'));
            res.status(200).json((0, customResponse_1.default)({ data: null, success: true, message: req.t('phone_verified') }));
        });
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
