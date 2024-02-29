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
exports.WebhooksRoute = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const tsyringe_1 = require("tsyringe");
const paymob_service_1 = require("../services/paymob.service");
let WebhooksRoute = class WebhooksRoute {
    constructor(paymobService) {
        this.paymobService = paymobService;
        this.path = '/webhooks';
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/paymob`, (0, express_async_handler_1.default)(async (req, res) => {
            let results;
            if (!req.body.obj.is_voided && !req.body.obj.is_refunded) {
                // console.log('webhook ======++++++>', req.body.obj);
                results = await this.paymobService.handleTransactionWebhook(req.body.obj, req.query.hmac);
            }
            res.status(200).json({ results });
        }));
        this.router.get(`${this.path}/paymob/success`, async (req, res) => {
            res.status(200).json({ message: 'success', data: req.query });
        });
    }
};
exports.WebhooksRoute = WebhooksRoute;
exports.WebhooksRoute = WebhooksRoute = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [paymob_service_1.PaymobService])
], WebhooksRoute);
