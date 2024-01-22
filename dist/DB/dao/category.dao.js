"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryDao = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const baseDao_1 = __importDefault(require("./baseDao"));
class CategoryDao extends baseDao_1.default {
    constructor() {
        super(category_model_1.default);
    }
    async getServiceByName(name) {
        return await category_model_1.default.findOne({ name }).lean();
    }
    async listServices(query = {}, paginate, sort = {}, select = '-__v') {
        // build the query
        let categories = category_model_1.default.find(query);
        if (paginate.skip)
            categories = categories.skip(paginate.skip);
        if (paginate.limit)
            categories = categories.limit(paginate.limit);
        categories = categories.sort(sort).select(select);
        // execute the query
        return await categories.lean();
    }
}
exports.CategoryDao = CategoryDao;
