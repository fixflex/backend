"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewDao = void 0;
const helpers_1 = require("../../helpers");
const models_1 = require("../models");
const base_dao_1 = __importDefault(require("./base.dao"));
class ReviewDao extends base_dao_1.default {
    constructor() {
        super(models_1.ReviewModel);
    }
    async getReviews(query) {
        // const countDocments = await ReviewModel.countDocuments();
        let apiFeatures = new helpers_1.QueryBuilder(models_1.ReviewModel.find(), query).filter();
        // .paginate(countDocments);
        const pagination = apiFeatures.pagination;
        const reviews = await apiFeatures.mongooseQuery;
        // TODO: Make apiFeatures more generic to handle all the populate and select methods , by removing the select and populate methods from the apiFeatures and make them as a method in the QueryBuilder class
        // .select('-__v  -images  -imageCover  -details')
        // .populate('userId', 'firstName lastName  profilePicture');
        return { reviews, pagination };
    }
}
exports.ReviewDao = ReviewDao;
