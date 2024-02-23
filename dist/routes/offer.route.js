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
exports.OfferRoute = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const offer_controller_1 = require("../controllers/offer.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const isMongoID_validator_1 = require("../middleware/validation/isMongoID.validator");
const offer_validator_1 = require("../middleware/validation/offer.validator");
let OfferRoute = class OfferRoute {
    constructor(offerController) {
        this.offerController = offerController;
        this.path = '/offers';
        this.router = (0, express_1.Router)();
        this.initializerRoutes();
    }
    initializerRoutes() {
        //### offers routes that don't require authentication
        this.router.get(`${this.path}/:id`, isMongoID_validator_1.isMongoId, this.offerController.getOfferById);
        this.router.get(`${this.path}`, this.offerController.getOffers);
        // =================================================================== //
        // ====>>>====>>>====>>>  require authentication <<<====<<<====<<<==== //
        // =================================================================== //
        /**
         * @description: All routes after this middleware require authentication
         * @param: authenticateUser
         * @type: middleware
         * @see: src/middleware/auth.middleware.ts
         * @note: All routes after this middleware require authentication
         */
        this.router.use(`${this.path}`, auth_middleware_1.authenticateUser);
        this.router.post(`${this.path}`, offer_validator_1.createOfferValidator, this.offerController.createOffer);
        this.router.patch(`${this.path}/:id`, isMongoID_validator_1.isMongoId, offer_validator_1.updateOfferValidator, this.offerController.updateOffer);
        this.router.delete(`${this.path}/:id`, isMongoID_validator_1.isMongoId, this.offerController.deleteOffer);
        this.router.patch(`${this.path}/:id/accept`, isMongoID_validator_1.isMongoId, this.offerController.acceptOffer);
        this.router.patch(`${this.path}/:id/accept/checkout`, isMongoID_validator_1.isMongoId, this.offerController.checkoutOffer);
        // webhook-checkout
        this.router.get(`${this.path}/webhook-checkout`, this.offerController.webhookCheckout);
    }
};
exports.OfferRoute = OfferRoute;
exports.OfferRoute = OfferRoute = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [offer_controller_1.OfferController])
], OfferRoute);
