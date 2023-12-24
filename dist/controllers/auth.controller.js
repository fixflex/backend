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
const dto_user_1 = require("../dtos/dto.user");
// import { IUser } from '../interfaces/user.interface';
const auth_service_1 = require("../services/auth.service");
const customResponse_1 = __importDefault(require("../utils/customResponse"));
// TODO: use passport.js for authentication
// TODO: refresh token and logout routes
let AuthController = exports.AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.signup = (0, express_async_handler_1.default)(async (req, res) => {
            let { user, accessToken, refreshToken } = await this.authService.signup(req.body);
            // Set accesstoken cookie
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none', // cross-site access allowed,
            });
            // Set refresh_token cookie
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                maxAge: 6 * 30 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none',
                path: '/api/v1/auth/refresh-token',
            });
            res.status(201).json({ data: new dto_user_1.UserDto(user), success: true, status: 201, message: 'User created', error: false });
        });
        this.login = (0, express_async_handler_1.default)(async (req, res) => {
            let { email, password } = req.body;
            let { user, accessToken, refreshToken } = await this.authService.login(email, password);
            // Set accesstoken cookie
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none', // cross-site access allowed,
            });
            // Set refresh_token cookie
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                maxAge: 6 * 30 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none',
                path: '/api/v1/auth/refresh-token',
            });
            res.status(200).json({ data: new dto_user_1.UserDto(user), success: true, status: 200, message: 'User logged in', error: false });
        });
        this.logout = (0, express_async_handler_1.default)(async (_req, res) => {
            res.clearCookie('refresh_token');
            res.clearCookie('accesstoken');
            res.status(200).json({ data: null, success: true, status: 200, message: 'User logged out', error: false });
        });
        this.googleLogin = (0, express_async_handler_1.default)(async (req, res) => {
            let { credential } = req.body;
            let { user, accessToken, refreshToken } = await this.authService.googleLogin(credential);
            // Set accesstoken cookie
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none', // cross-site access allowed,
            });
            // Set refresh_token cookie
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                maxAge: 6 * 30 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none',
                path: '/api/v1/auth/refresh-token',
            });
            res.status(200).json({ data: new dto_user_1.UserDto(user), success: true, status: 200, message: 'User logged in', error: false });
        });
        this.refreshToken = (0, express_async_handler_1.default)(async (req, res) => {
            // get refresh_token from cookies
            let refreshToken = req.cookies.refresh_token;
            // let accessToken_ = req.cookies.access_token;
            if (!refreshToken) {
                res.status(401).json((0, customResponse_1.default)({ data: null, success: false, status: 401, message: 'You are not authorized, you must login to get access this route', error: true }));
                return;
            }
            let { accessToken } = await this.authService.refreshToken(refreshToken);
            // Set accesstoken cookie
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none', // cross-site access allowed,
            });
            res.status(200).json({ data: null, success: true, status: 200, message: 'Access token refreshed', error: false });
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
            // Set cookies
            // Set accesstoken cookie
            res.cookie('access_token', results.accessToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none', // cross-site access allowed,
            });
            // Set refresh_token cookie
            res.cookie('refresh_token', results.refreshToken, {
                httpOnly: true,
                maxAge: 6 * 30 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none',
                path: '/api/v1/auth/refresh-token',
            });
            res.status(200).json({ data: new dto_user_1.UserDto(results.user), success: true, status: 200, message: 'Password reset done', error: false });
        });
    }
};
exports.AuthController = AuthController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthServie])
], AuthController);
