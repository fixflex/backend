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
exports.ReviewController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const tsyringe_1 = require("tsyringe");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const helpers_1 = require("../helpers");
const services_1 = require("../services");
let ReviewController = class ReviewController {
    constructor(reviewService) {
        this.reviewService = reviewService;
        this.createReview = (0, express_async_handler_1.default)(async (req, res, next) => {
            let review = await this.reviewService.createReview(req.body, req.user._id.toString());
            if (!review)
                return next(new HttpException_1.default(400, 'something_went_wrong'));
            res.status(201).json((0, helpers_1.customResponse)({ data: review, success: true, message: req.t('review_created') }));
        });
        this.getReviews = (0, express_async_handler_1.default)(async (req, res, _next) => {
            let reviews = await this.reviewService.getReviews(req.query);
            res.status(200).json((0, helpers_1.customResponse)({ data: reviews, success: true, message: req.t('reviews_fetched') }));
        });
        this.getReviewById = (0, express_async_handler_1.default)(async (req, res, next) => {
            let review = await this.reviewService.getReviewById(req.params.id);
            if (!review)
                return next(new HttpException_1.default(404, 'review_not_found'));
            res.status(200).json((0, helpers_1.customResponse)({ data: review, success: true, message: req.t('review_fetched') }));
        });
        this.updateReview = (0, express_async_handler_1.default)(async (req, res, next) => {
            let review = await this.reviewService.updateReview(req.params.id, req.body, req.user._id.toString());
            if (!review.modifiedCount)
                return next(new HttpException_1.default(400, 'something_went_wrong'));
            res.status(200).json((0, helpers_1.customResponse)({ data: review, success: true, message: req.t('review_updated') }));
        });
        this.deleteReview = (0, express_async_handler_1.default)(async (req, res, next) => {
            let review = await this.reviewService.deleteReview(req.params.id, req.user._id.toString());
            if (!review.deletedCount)
                return next(new HttpException_1.default(400, 'something_went_wrong'));
            res.status(204).json((0, helpers_1.customResponse)({ data: null, success: true, message: req.t('review_deleted') }));
        });
    }
};
exports.ReviewController = ReviewController;
exports.ReviewController = ReviewController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [services_1.ReviewServiec])
], ReviewController);
