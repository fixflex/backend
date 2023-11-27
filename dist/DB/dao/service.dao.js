"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_model_1 = __importDefault(require("../models/services.model"));
const commonDAO_1 = __importDefault(require("./commonDAO"));
class ServiceDao extends commonDAO_1.default {
    constructor() {
        super(services_model_1.default);
    }
    async getServiceByName(name) {
        return await services_model_1.default.findOne({ name }).lean();
    }
    async listServices(query = {}, paginate, sort = {}, select = '-__v') {
        // build the query
        let services = services_model_1.default.find(query);
        if (paginate.skip)
            services = services.skip(paginate.skip);
        if (paginate.limit)
            services = services.limit(paginate.limit);
        services = services.sort(sort).select(select);
        // execute the query
        return await services.lean();
    }
}
exports.default = ServiceDao;
