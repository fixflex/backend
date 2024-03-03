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
exports.TaskerRoute = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const tasker_controller_1 = require("../controllers/tasker.controller");
// import { UserType } from '../../interfaces/user.interface';
const auth_middleware_1 = require("../middleware/auth.middleware");
const isMongoID_validator_1 = require("../middleware/validation/isMongoID.validator");
const tasker_validator_1 = require("../middleware/validation/tasker.validator");
let TaskerRoute = class TaskerRoute {
    constructor(taskerController) {
        this.taskerController = taskerController;
        this.path = '/taskers';
        this.router = (0, express_1.Router)();
        this.insitializeRoutes();
    }
    insitializeRoutes() {
        //  Logged in user routes (authenticated)
        this.router.post(`${this.path}/become-tasker`, auth_middleware_1.authenticateUser, tasker_validator_1.createTaskerValidator, this.taskerController.createTasker);
        this.router.get(`${this.path}/me`, auth_middleware_1.authenticateUser, this.taskerController.getMe);
        this.router.patch(`${this.path}/me`, auth_middleware_1.authenticateUser, tasker_validator_1.updateTaskerValidator, this.taskerController.updateMe);
        // this.router.delete(`${this.path}/me`, authenticateUser, this.taskerController.deleteTasker);
        this.router.post(`${this.path}/commission-pay`, auth_middleware_1.authenticateUser, this.taskerController.checkout);
        // this.router.post(`${this.path}/checkout`, authenticateUser, this.taskerController.checkout);
        // this.router.post(`${this.path}/withdraw-earnings`, authenticateUser, this.taskerController.withdrawEarnings)
        // apply coupon
        this.router.post(`${this.path}/apply-coupon`, auth_middleware_1.authenticateUser, this.taskerController.applyCoupon);
        // Public routes
        this.router.get(`${this.path}/:id`, isMongoID_validator_1.isMongoId, this.taskerController.getTaskerPublicProfile);
        // get list of taskers by location and service (optional)
        this.router.get(`${this.path}`, this.taskerController.getTaskers);
        // Admin routes
        // this.router.use(`${this.path}`, authenticateUser, allowedTo(UserType.ADMIN));
        // this.router.get(`${this.path}`, this.taskerController.getListOfTaskers);
    }
};
exports.TaskerRoute = TaskerRoute;
exports.TaskerRoute = TaskerRoute = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [tasker_controller_1.TaskerController])
], TaskerRoute);
