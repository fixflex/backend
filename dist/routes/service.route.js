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
import { ServiceController } from '../controllers/service.controller';
import { UserType } from '../interfaces/user.interface';
import { allowedTo, authenticateUser } from '../middleware/auth.middleware';
import { isMongoId } from '../middleware/validation/isMongoID.validator';
import { createServiceValidator } from '../middleware/validation/serviceValidator';
export let ServiceRoute = class ServiceRoute {
    constructor(serviceController) {
        this.serviceController = serviceController;
        this.path = '/services';
        this.router = Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Public routes
        this.router.get(`${this.path}`, this.serviceController.getServices);
        this.router.get(`${this.path}/:id`, isMongoId, this.serviceController.getService);
        // Admin routes
        this.router.use(`${this.path}`, authenticateUser, allowedTo(UserType.ADMIN));
        this.router.post(`${this.path}`, createServiceValidator, this.serviceController.createService);
        this.router.patch(`${this.path}/:id`, isMongoId, this.serviceController.updateService);
        this.router.delete(`${this.path}/:id`, isMongoId, this.serviceController.deleteService);
    }
};
ServiceRoute = __decorate([
    autoInjectable(),
    __metadata("design:paramtypes", [ServiceController])
], ServiceRoute);
