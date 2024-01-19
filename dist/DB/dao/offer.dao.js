"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferDao = void 0;
const offer_model_1 = __importDefault(require("../models/offer.model"));
const commonDAO_1 = __importDefault(require("./commonDAO"));
class OfferDao extends commonDAO_1.default {
    constructor() {
        super(offer_model_1.default);
    }
}
exports.OfferDao = OfferDao;
