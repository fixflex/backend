"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryDao = void 0;
const validateEnv_1 = __importDefault(require("../../config/validateEnv"));
const category_model_1 = __importDefault(require("../models/category.model"));
const baseDao_1 = __importDefault(require("./baseDao"));
class CategoryDao extends baseDao_1.default {
    // private readonly categoryModel = CategoryModel;
    // inject the reqLanguage to the constructor to be used in the toJSONLocalizedOnly method
    constructor() {
        super(category_model_1.default);
    }
    async getCategoryByName(name) {
        return await category_model_1.default.findOne({ name });
    }
    async getCategories(query = {}, paginate, sort = {}, select = '-__v') {
        // build the query
        let categories = category_model_1.default.find(query);
        if (paginate.skip)
            categories = categories.skip(paginate.skip);
        if (paginate.limit)
            categories = categories.limit(paginate.limit);
        categories = categories.sort(sort).select(select);
        // execute the query
        let categoriesList = await categories;
        return categoriesList;
    }
    toJSONLocalizedOnly(doc, reqLanguage = validateEnv_1.default.defaultLocale) {
        let localizedDoc = category_model_1.default.schema.methods.toJSONLocalizedOnly(doc, reqLanguage);
        return localizedDoc;
    }
}
exports.CategoryDao = CategoryDao;
