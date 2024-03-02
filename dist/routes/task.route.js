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
exports.TaskRoute = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const task_controller_1 = require("../controllers/task.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const isMongoID_validator_1 = require("../middleware/validation/isMongoID.validator");
const tasks_validator_1 = require("../middleware/validation/tasks.validator");
const review_route_1 = require("./review.route");
let TaskRoute = class TaskRoute {
    constructor(taskController, reviewRoute) {
        this.taskController = taskController;
        this.reviewRoute = reviewRoute;
        this.path = '/tasks';
        this.router = (0, express_1.Router)();
        this.initializerRoutes();
    }
    initializerRoutes() {
        // Nested route
        this.router.all(`${this.path}/:id/reviews/:reviewId?`, // the ? means that the param is optional
        (req, _res, next) => {
            // Append taskId to req.query
            req.query = {
                ...req.query,
                taskId: req.params.id,
            };
            if (req.method === 'POST') {
                req.body = {
                    ...req.body,
                    taskId: req.params.id,
                };
            }
            // Remove '/tasks/:id' from req.url
            req.url = req.url.replace(`${this.path}/${req.params.id}`, '');
            next();
        }, this.reviewRoute.router);
        this.router.get(`${this.path}`, this.taskController.getTasks);
        this.router.get(`${this.path}/:id`, isMongoID_validator_1.isMongoId, this.taskController.getTaskById);
        // this.router.get(`${this.path}/:id/offers`, this.taskController.getTaskOffers);
        // =================================================================== //
        // ====>>>====>>>====>>>  require authentication <<<====<<<====<<<==== //
        // =================================================================== //
        this.router.use(`${this.path}`, auth_middleware_1.authenticateUser);
        this.router.post(`${this.path}`, tasks_validator_1.createTaskValidator, this.taskController.createTask);
        // uplaodTaskImages,
        this.router.patch(`${this.path}/:id`, isMongoID_validator_1.isMongoId, tasks_validator_1.updateTaskValidator, this.taskController.updateTask);
        this.router.patch(`${this.path}/:id/images`, isMongoID_validator_1.isMongoId, this.taskController.taskImages, this.taskController.uploadTaskImages);
        // this.router.delete(`${this.path}/:id`, isMongoId, this.taskController.deleteTask);
        // checkout
        this.router.patch(`${this.path}/checkout/:id`, isMongoID_validator_1.isMongoId, this.taskController.checkoutTask);
        // ==================== offer status ==================== //
        this.router.patch(`${this.path}/:id/open`, isMongoID_validator_1.isMongoId, this.taskController.openTask);
        this.router.patch(`${this.path}/:id/cancel`, isMongoID_validator_1.isMongoId, this.taskController.cancelTask);
        this.router.patch(`${this.path}/:id/complete`, isMongoID_validator_1.isMongoId, this.taskController.completeTask);
    }
};
exports.TaskRoute = TaskRoute;
exports.TaskRoute = TaskRoute = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [task_controller_1.TaskController, review_route_1.ReviewRoute])
], TaskRoute);
// this.router.get(`${this.path}/:id/images`, this.taskController.getTaskImages);
// this.router.get(`${this.path}/:id/owner`, this.taskController.getTaskOwner);
// this.router.get(`${this.path}/:id/tasker`, this.taskController.getTaskTasker);
// this.router.get(`${this.path}/:id/chat`, this.taskController.getTaskChat);
