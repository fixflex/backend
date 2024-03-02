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
exports.ReviewRoute = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const validation_1 = require("../middleware/validation");
let ReviewRoute = class ReviewRoute {
    constructor(reviewController) {
        this.reviewController = reviewController;
        this.path = '/reviews';
        this.router = (0, express_1.Router)();
        this.initializerRoutes();
    }
    initializerRoutes() {
        // public routes
        this.router.get(`${this.path}`, this.reviewController.getReviews);
        this.router.get(`${this.path}/:id`, validation_1.isMongoId, this.reviewController.getReviewById);
        // =================================================================== //
        // ====>>>====>>>====>>>  require authentication <<<====<<<====<<<==== //
        // =================================================================== //
        this.router.use(`${this.path}`, middleware_1.authenticateUser);
        this.router.post(`${this.path}`, validation_1.createReviewValidator, this.reviewController.createReview);
        this.router.patch(`${this.path}/:id`, validation_1.updateReviewValidator, this.reviewController.updateReview);
        this.router.delete(`${this.path}/:id`, this.reviewController.deleteReview);
    }
};
exports.ReviewRoute = ReviewRoute;
exports.ReviewRoute = ReviewRoute = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [controllers_1.ReviewController])
], ReviewRoute);
