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
exports.CouponController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// coupon controller
const tsyringe_1 = require("tsyringe");
// import { ICouponController } from '../interfaces';
const services_1 = require("../services");
let CouponController = class CouponController {
    constructor(couponService) {
        this.couponService = couponService;
        this.createCoupon = (0, express_async_handler_1.default)(async (req, res) => {
            req.body.createdBy = req.user._id;
            req.body.remainingUses = req.body.maxUses;
            const coupon = await this.couponService.createCoupon(req.body);
            res.status(201).json({ data: coupon, success: true, message: 'coupon_created' });
        });
    }
};
exports.CouponController = CouponController;
exports.CouponController = CouponController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [services_1.CouponService])
], CouponController);
