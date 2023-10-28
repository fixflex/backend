"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_model_1 = __importDefault(require("../models/services.model"));
class ServiceDao {
    static async getServiceByName(name) {
        return await services_model_1.default.findOne({ name }).lean();
    }
    static async getServiceById(serviceId) {
        return await services_model_1.default.findById(serviceId).lean();
    }
    static async listServices(query = {}, paginate, sort = {}, select = '-__v') {
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
    static async create(service) {
        return await services_model_1.default.create(service);
    }
    static async update(serviceId, service) {
        return await services_model_1.default.findByIdAndUpdate(serviceId, service, { new: true }).lean();
    }
    static async delete(serviceId) {
        return await services_model_1.default.findByIdAndDelete(serviceId).lean();
    }
}
exports.default = ServiceDao;
