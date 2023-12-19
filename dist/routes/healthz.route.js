"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customResponse_1 = __importDefault(require("../utils/customResponse"));
class HealthzRoute {
    constructor() {
        this.path = '/healthz';
        this.router = (0, express_1.Router)();
        this.initializerRoutes();
    }
    initializerRoutes() {
        this.router.get(`${this.path}`, (_req, res) => {
            res.status(200).json((0, customResponse_1.default)({ data: null, success: true, status: 200, message: 'Welcome to Rest API - 👋🌎🌍🌏', error: false }));
        });
        this.router.get('/', (_req, res) => {
            // log request cookies
            console.log('Cookies: ', _req.cookies);
            res.status(200).json((0, customResponse_1.default)({ data: null, success: true, status: 200, message: 'Welcome to Rest API - 👋🌎🌍🌏', error: false }));
        });
    }
}
exports.default = HealthzRoute;
