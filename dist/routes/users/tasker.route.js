var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Router } from 'express';
import { autoInjectable } from 'tsyringe';
import { TaskerController } from '../../controllers/users/tasker.controller';
// import { UserType } from '../../interfaces/user.interface';
import { authenticateUser } from '../../middleware/auth.middleware';
import { isMongoId } from '../../middleware/validation/isMongoID.validator';
import { createTaskerValidator, updateTaskerValidator } from '../../middleware/validation/users/tasker.validator';
let TaskerRoute = class TaskerRoute {
    constructor(taskerController) {
        this.taskerController = taskerController;
        this.path = '/taskers';
        this.router = Router();
        this.insitializeRoutes();
    }
    insitializeRoutes() {
        //  Logged in user routes (authenticated)
        this.router.post(`${this.path}/become-tasker`, authenticateUser, createTaskerValidator, this.taskerController.becomeTasker);
        this.router.get(`${this.path}/me`, authenticateUser, this.taskerController.getTaskerProfile);
        this.router.patch(`${this.path}/me`, authenticateUser, updateTaskerValidator, this.taskerController.updateMyTaskerProfile);
        this.router.delete(`${this.path}/me`, authenticateUser, this.taskerController.deleteMyTaskerProfile);
        // Public routes
        this.router.get(`${this.path}/:id`, isMongoId, this.taskerController.getTaskerProfile);
        // get list of taskers by location and service (optional)
        // the api for this route is like this: /taskers?longitude=32.1617485&latitude=26.0524745&services=5f9d5f6b0f0a7e2a3c9d3b1a
        this.router.get(`${this.path}`, this.taskerController.getListOfTaskers);
        // Admin routes
        // this.router.use(`${this.path}`, authenticateUser, allowedTo(UserType.ADMIN));
        // this.router.get(`${this.path}`, this.taskerController.getListOfTaskers);
    }
};
TaskerRoute = __decorate([
    autoInjectable(),
    __metadata("design:paramtypes", [TaskerController])
], TaskerRoute);
export { TaskerRoute };
