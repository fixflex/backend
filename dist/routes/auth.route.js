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
exports.AuthRoute = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const controllers_1 = require("../controllers");
const validation_1 = require("../middleware/validation");
let AuthRoute = exports.AuthRoute = class AuthRoute {
    constructor(authController) {
        this.authController = authController;
        this.path = '/auth';
        this.router = (0, express_1.Router)();
        this.initializerRoutes();
    }
    initializerRoutes() {
        this.router.post(`${this.path}/signup`, validation_1.signupValidator, this.authController.signup);
        this.router.post(`${this.path}/login`, validation_1.loginValidator, this.authController.login);
        this.router.post(`${this.path}/forgotPassword`, this.authController.forgotPassword);
        this.router.post(`${this.path}/verifyResetCode`, this.authController.verifyPassResetCode);
        this.router.patch(`${this.path}/resetPassword`, this.authController.resetPassword);
    }
};
exports.AuthRoute = AuthRoute = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [controllers_1.AuthController])
], AuthRoute);
