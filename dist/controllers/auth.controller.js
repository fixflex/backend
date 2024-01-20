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
const validateEnv_1 = __importDefault(require("../config/validateEnv"));
const dtos_1 = require("../dtos");
const helpers_1 = require("../helpers");
const services_1 = require("../services");
// TODO: use passport.js for authentication
let AuthController = exports.AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.accessTokenCookieOptions = {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: validateEnv_1.default.NODE_ENV !== 'development',
            sameSite: validateEnv_1.default.NODE_ENV === 'production' ? 'none' : 'lax', // sameSite is none if secure is true and lax if secure is false because we are using cors and we are not using csrf protection
        };
        this.refreshTokenCookieOptions = {
            httpOnly: true,
            maxAge: 6 * 30 * 24 * 60 * 60 * 1000,
            secure: validateEnv_1.default.NODE_ENV !== 'development',
            sameSite: validateEnv_1.default.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/api/v1/auth/refresh-token',
        };
        this.signup = (0, express_async_handler_1.default)(async (req, res) => {
            let { user, accessToken, refreshToken } = await this.authService.signup(req.body);
            res.cookie('access_token', accessToken, this.accessTokenCookieOptions);
            res.cookie('refresh_token', refreshToken, this.refreshTokenCookieOptions);
            res.status(201).json({ data: new dtos_1.UserDto(user), success: true, status: 201, message: 'User created', error: false });
        });
        this.login = (0, express_async_handler_1.default)(async (req, res) => {
            let { email, password } = req.body;
            let { user, accessToken, refreshToken } = await this.authService.login(email, password);
            res.cookie('access_token', accessToken, this.accessTokenCookieOptions);
            res.cookie('refresh_token', refreshToken, this.refreshTokenCookieOptions);
            res.status(200).json({ data: new dtos_1.UserDto(user), success: true, status: 200, message: 'User logged in', error: false });
        });
        this.logout = (0, express_async_handler_1.default)(async (req, res) => {
            console.log(req.cookies);
            if (!req.cookies.access_token) {
                res.status(401).json((0, helpers_1.customResponse)({ data: null, success: false, status: 401, message: 'You are not authorized, you must login to get access this route', error: true }));
                return;
            }
            res.clearCookie('refresh_token');
            res.clearCookie('access_token');
            res.status(200).json({ data: null, success: true, status: 200, message: 'User logged out', error: false });
        });
        this.googleLogin = (0, express_async_handler_1.default)(async (req, res) => {
            let { credential } = req.body;
            if (!credential) {
                res.status(400).json((0, helpers_1.customResponse)({ data: null, success: false, status: 400, message: 'Bad Request.', error: true }));
                return;
            }
            let { user, accessToken, refreshToken } = await this.authService.googleLogin(credential);
            res.cookie('access_token', accessToken, this.accessTokenCookieOptions);
            res.cookie('refresh_token', refreshToken, this.refreshTokenCookieOptions);
            res.status(200).json({ data: new dtos_1.UserDto(user), success: true, status: 200, message: 'User logged in', error: false });
        });
        this.refreshToken = (0, express_async_handler_1.default)(async (req, res) => {
            if (!req.cookies.refresh_token || !req.cookies.access_token) {
                res.status(401).json((0, helpers_1.customResponse)({ data: null, success: false, status: 401, message: 'You are not authorized, you must login to get access this route', error: true }));
                return;
            }
            let { accessToken } = await this.authService.refreshToken(req.cookies.refresh_token);
            res.cookie('access_token', accessToken, this.accessTokenCookieOptions);
            res.status(200).json({ data: null, success: true, status: 200, message: 'Access token refreshed', error: false });
        });
        this.forgotPassword = (0, express_async_handler_1.default)(async (req, res) => {
            let { email } = req.body;
            await this.authService.forgotPassword(email);
            res.status(200).json((0, helpers_1.customResponse)({ data: null, success: true, status: 200, message: 'Password reset done sent to email!, please check your email inbox', error: false }));
        });
        this.verifyPassResetCode = (0, express_async_handler_1.default)(async (req, res) => {
            let { resetCode } = req.body;
            await this.authService.verifyPassResetCode(resetCode);
            res.status(200).json((0, helpers_1.customResponse)({ data: null, success: true, status: 200, message: 'Password reset code verified', error: false }));
        });
        this.resetPassword = (0, express_async_handler_1.default)(async (req, res) => {
            let { email, newPassword } = req.body;
            let results = await this.authService.resetPassword(email, newPassword);
            res.cookie('access_token', results.accessToken, this.accessTokenCookieOptions);
            res.cookie('refresh_token', results.refreshToken, this.refreshTokenCookieOptions);
            res.status(200).json((0, helpers_1.customResponse)({ data: new dtos_1.UserDto(results.user), success: true, status: 200, message: 'Password reset done', error: false }));
        });
        this.changePassword = (0, express_async_handler_1.default)(async (req, res) => {
            let { token } = await this.authService.changePassword(req.body, req.user);
            res.cookie('access_token', token, this.accessTokenCookieOptions);
            res.status(200).json((0, helpers_1.customResponse)({ data: null, success: true, status: 200, message: 'Password changed', error: false }));
        });
    }
};
exports.AuthController = AuthController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [services_1.AuthServie])
], AuthController);
