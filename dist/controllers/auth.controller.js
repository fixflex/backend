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
exports.AuthController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const tsyringe_1 = require("tsyringe");
// import { IUser } from '../interfaces/user.interface';
const auth_service_1 = require("../services/auth.service");
const customResponse_1 = __importDefault(require("../utils/customResponse"));
// TODO: use passport.js for authentication
// TODO: refresh token and logout routes
let AuthController = exports.AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.signup = (0, express_async_handler_1.default)(async (req, res) => {
            let { user, token } = await this.authService.signup(req.body);
            res.status(201).json(Object.assign((0, customResponse_1.default)({ data: user, success: true, status: 201, message: 'User created', error: false }), { token }));
        });
        this.login = (0, express_async_handler_1.default)(async (req, res) => {
            let { email, password } = req.body;
            let { user, token } = await this.authService.login(email, password);
            res.status(200).json(Object.assign((0, customResponse_1.default)({ data: user, success: true, status: 200, message: 'User logged in', error: false }), { token }));
        });
        this.forgotPassword = (0, express_async_handler_1.default)(async (req, res) => {
            let { email } = req.body;
            await this.authService.forgotPassword(email);
            res.status(200).json((0, customResponse_1.default)({ data: null, success: true, status: 200, message: 'Password reset done sent to email!, please check your email inbox', error: false }));
        });
        this.verifyPassResetCode = (0, express_async_handler_1.default)(async (req, res) => {
            let { resetCode } = req.body;
            await this.authService.verifyPassResetCode(resetCode);
            res.status(200).json((0, customResponse_1.default)({ data: null, success: true, status: 200, message: 'Password reset code verified', error: false }));
        });
        this.resetPassword = (0, express_async_handler_1.default)(async (req, res) => {
            let { email, newPassword } = req.body;
            let results = await this.authService.resetPassword(email, newPassword);
            res.status(200).json(Object.assign((0, customResponse_1.default)({ data: results.user, success: true, status: 200, message: 'Password reset done', error: false }), { token: results.token }));
        });
    }
};
exports.AuthController = AuthController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthServie])
], AuthController);
