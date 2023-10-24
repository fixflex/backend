"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class HealthzRoute {
    constructor() {
        this.path = '/healthz';
        this.router = (0, express_1.Router)();
        this.initializerRoutes();
    }
    initializerRoutes() {
        this.router.get(`${this.path}`, (_req, res) => {
            res.status(200).send('OK');
        });
    }
}
exports.default = HealthzRoute;
