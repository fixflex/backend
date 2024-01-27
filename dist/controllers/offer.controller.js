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
exports.OfferController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const tsyringe_1 = require("tsyringe");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const customResponse_1 = __importDefault(require("../helpers/customResponse"));
const offer_service_1 = require("../services/offer.service");
let OfferController = class OfferController {
    constructor(offerService) {
        this.offerService = offerService;
        this.createOffer = (0, express_async_handler_1.default)(async (req, res, next) => {
            const offer = await this.offerService.createOffer(req.body, req.user?._id);
            if (!offer)
                return next(new HttpException_1.default(400, 'Something went wrong, please try again later'));
            res.status(201).json((0, customResponse_1.default)({ data: offer, success: true, message: 'Offer created' }));
        });
        this.getOffersByTaskId = (0, express_async_handler_1.default)(async (req, res) => {
            const offers = await this.offerService.getOffers(req.query.taskId);
            res.status(200).json((0, customResponse_1.default)({ data: offers, success: true, message: null }));
        });
        this.getOfferById = (0, express_async_handler_1.default)(async (req, res, next) => {
            const offer = await this.offerService.getOfferById(req.params.id);
            if (!offer)
                return next(new HttpException_1.default(404, `Offer with id ${req.params.id} not found`));
            res.status(200).json((0, customResponse_1.default)({ data: offer, success: true, message: null }));
        });
        this.updateOffer = (0, express_async_handler_1.default)(async (req, res, next) => {
            const offer = await this.offerService.updateOffer(req.params.id, req.body, req.user?._id);
            if (!offer)
                return next(new HttpException_1.default(404, `Offer with id ${req.params.id} not found`));
            res.status(200).json((0, customResponse_1.default)({ data: offer, success: true, message: 'Offer updated' }));
        });
        this.deleteOffer = (0, express_async_handler_1.default)(async (req, res, next) => {
            const offer = await this.offerService.deleteOffer(req.params.id, req.user?._id);
            if (!offer)
                return next(new HttpException_1.default(404, `Offer with id ${req.params.id} not found`));
            res.status(200).json((0, customResponse_1.default)({ data: null, success: true, message: 'Offer deleted' }));
        });
    }
};
exports.OfferController = OfferController;
exports.OfferController = OfferController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [offer_service_1.OfferService])
], OfferController);
