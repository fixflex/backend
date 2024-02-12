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
exports.CouponRoute = void 0;
// coupon.route.ts
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const controllers_1 = require("../controllers");
const interfaces_1 = require("../interfaces");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_1 = require("../middleware/validation");
let CouponRoute = class CouponRoute {
    constructor(couponController) {
        this.couponController = couponController;
        this.path = '/coupons';
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(`${this.path}`, auth_middleware_1.authenticateUser, (0, auth_middleware_1.allowedTo)(interfaces_1.UserType.ADMIN));
        this.router.post(`${this.path}`, validation_1.createCouponValidator, this.couponController.createCoupon);
        // this.router.get(`${this.path}`, this.couponController.getAllCoupons);
        // this.router.get(`${this.path}/:id`, isMongoId, this.couponController.getCouponById);
        // this.router.patch(`${this.path}/:id`, isMongoId, createCouponValidator, this.couponController.updateCoupon);
        // this.router.delete(`${this.path}/:id`, isMongoId, this.couponController.deleteCoupon);
    }
};
exports.CouponRoute = CouponRoute;
exports.CouponRoute = CouponRoute = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [controllers_1.CouponController])
], CouponRoute);