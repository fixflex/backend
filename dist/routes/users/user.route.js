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
exports.UserRoute = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const user_controller_1 = require("../../controllers/users/user.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const uploadImages_middleware_1 = require("../../middleware/uploadImages.middleware");
const validation_1 = require("../../middleware/validation");
let UserRoute = class UserRoute {
    constructor(userController) {
        this.userController = userController;
        this.path = '/users';
        this.router = (0, express_1.Router)();
        this.insitializeRoutes();
    }
    insitializeRoutes() {
        //  Logged in user routes (authenticated)
        this.router
            .route(`${this.path}/me`)
            .get(auth_middleware_1.authenticateUser, this.userController.getMe)
            .patch(auth_middleware_1.authenticateUser, validation_1.updateLoggedUserValidator, this.userController.updateMe)
            .delete(auth_middleware_1.authenticateUser, this.userController.deleteMe);
        this.router.route(`${this.path}/profile-picture-upload`).patch(uploadImages_middleware_1.imageUpload.single('profilePicture'), this.userController.updateMyProfileImage);
        // Public routes
        this.router.get(`${this.path}/:id`, validation_1.getUserValidator, this.userController.getUser);
    }
};
exports.UserRoute = UserRoute;
exports.UserRoute = UserRoute = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [user_controller_1.UserController])
], UserRoute);