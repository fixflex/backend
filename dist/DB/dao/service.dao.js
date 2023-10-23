var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ServiceModel from '../models/services.model';
class ServiceDao {
    static getServiceByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ServiceModel.findOne({ name }).lean();
        });
    }
    static getServiceById(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ServiceModel.findById(serviceId).lean();
        });
    }
    static listServices(query = {}, paginate, sort = {}, select = '-__v') {
        return __awaiter(this, void 0, void 0, function* () {
            // build the query
            let services = ServiceModel.find(query);
            if (paginate.skip)
                services = services.skip(paginate.skip);
            if (paginate.limit)
                services = services.limit(paginate.limit);
            services = services.sort(sort).select(select);
            // execute the query
            return yield services.lean();
        });
    }
    static create(service) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ServiceModel.create(service);
        });
    }
    static update(serviceId, service) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ServiceModel.findByIdAndUpdate(serviceId, service, { new: true }).lean();
        });
    }
    static delete(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ServiceModel.findByIdAndDelete(serviceId).lean();
        });
    }
}
export default ServiceDao;
