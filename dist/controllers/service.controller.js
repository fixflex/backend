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
exports.ServiceController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const tsyringe_1 = require("tsyringe");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const customResponse_1 = __importDefault(require("../helpers/customResponse"));
const service_service_1 = require("../services/service.service");
let ServiceController = class ServiceController {
    constructor(serviceService) {
        this.serviceService = serviceService;
        // public Routes
        this.getServiceById = (0, express_async_handler_1.default)(async (req, res) => {
            let service = await this.serviceService.getService(req.params.id);
            if (!service)
                throw new HttpException_1.default(404, 'No service found');
            res.status(200).json((0, customResponse_1.default)({ data: service, success: true, status: 200, message: 'Service found', error: false }));
        });
        this.getServices = (0, express_async_handler_1.default)(async (req, res) => {
            let { services, paginate } = await this.serviceService.getServices(req.query);
            res.status(200).json(Object.assign((0, customResponse_1.default)({ data: services, success: true, status: 200, message: 'Services found', error: false }), { paginate }));
        });
        // authenticated routes
        this.createService = (0, express_async_handler_1.default)(async (req, res, next) => {
            if (!req.body)
                return next(new HttpException_1.default(400, 'Please provide a service'));
            let service = await this.serviceService.createService(req.body);
            res.status(201).json({ data: service });
        });
        this.updateService = (0, express_async_handler_1.default)(async (req, res, next) => {
            if (!req.body)
                return next(new HttpException_1.default(400, 'Please provide a service'));
            let service = await this.serviceService.updateService(req.params.id, req.body);
            if (!service)
                return next(new HttpException_1.default(404, 'No service found'));
            res.status(200).json({ data: service });
        });
        this.uploadServiceImage = (0, express_async_handler_1.default)(async (req, res, next) => {
            if (!req.file)
                return next(new HttpException_1.default(400, 'Please provide an image'));
            let service = await this.serviceService.uploadServiceImage(req.params.id, req.file);
            if (!service)
                return next(new HttpException_1.default(404, 'No service found'));
            res.status(200).json({ data: service });
        });
        this.deleteService = (0, express_async_handler_1.default)(async (req, res, next) => {
            let service = await this.serviceService.deleteService(req.params.id);
            if (!service)
                return next(new HttpException_1.default(404, 'No service found'));
            res.sendStatus(204);
        });
    }
};
exports.ServiceController = ServiceController;
exports.ServiceController = ServiceController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [service_service_1.ServiceService])
], ServiceController);
