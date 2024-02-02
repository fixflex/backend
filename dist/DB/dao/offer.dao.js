"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferDao = void 0;
const helpers_1 = require("../../helpers");
const offer_model_1 = __importDefault(require("../models/offer.model"));
const baseDao_1 = __importDefault(require("./baseDao"));
class OfferDao extends baseDao_1.default {
    constructor() {
        super(offer_model_1.default);
    }
    async getOffers(query) {
        const countDocments = await offer_model_1.default.countDocuments();
        let apiFeatures = new helpers_1.QueryBuilder(offer_model_1.default.find(), query).filter().sort('-createdAt').limitFields().paginate(countDocments);
        const pagination = apiFeatures.pagination;
        const offers = await apiFeatures.mongooseQuery.select('-__v');
        // .populate('taskId')
        // .populate({ path: 'taskerId', populate: { path: 'userId' } });
        return { offers, pagination };
    }
}
exports.OfferDao = OfferDao;
