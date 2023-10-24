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
exports.ServiceRoute = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const service_controller_1 = require("../controllers/service.controller");
const user_interface_1 = require("../interfaces/user.interface");
const auth_middleware_1 = require("../middleware/auth.middleware");
const isMongoID_validator_1 = require("../middleware/validation/isMongoID.validator");
const serviceValidator_1 = require("../middleware/validation/serviceValidator");
let ServiceRoute = class ServiceRoute {
    constructor(serviceController) {
        this.serviceController = serviceController;
        this.path = '/services';
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Public routes
        this.router.get(`${this.path}`, this.serviceController.getServices);
        this.router.get(`${this.path}/:id`, isMongoID_validator_1.isMongoId, this.serviceController.getService);
        // Admin routes
        this.router.use(`${this.path}`, auth_middleware_1.authenticateUser, (0, auth_middleware_1.allowedTo)(user_interface_1.UserType.ADMIN));
        this.router.post(`${this.path}`, serviceValidator_1.createServiceValidator, this.serviceController.createService);
        this.router.patch(`${this.path}/:id`, isMongoID_validator_1.isMongoId, this.serviceController.updateService);
        this.router.delete(`${this.path}/:id`, isMongoID_validator_1.isMongoId, this.serviceController.deleteService);
    }
};
exports.ServiceRoute = ServiceRoute;
exports.ServiceRoute = ServiceRoute = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [service_controller_1.ServiceController])
], ServiceRoute);
