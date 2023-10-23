var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ServiceDao from '../../DB/dao/service.dao';
import TaskerDao from '../../DB/dao/tasker.dao';
import HttpException from '../../exceptions/HttpException';
class TaskerService {
    registerAsTasker(userId, tasker) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(tasker.services.map((service) => __awaiter(this, void 0, void 0, function* () {
                let serviceExists = yield ServiceDao.getServiceById(service);
                if (!serviceExists)
                    throw new HttpException(404, `Service ID ${service} doesn't exist in DB`);
                return service;
            })));
            tasker.userId = userId;
            return yield TaskerDao.create(tasker);
        });
    }
    getTaskerProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield TaskerDao.getTaskerByUserId(userId);
        });
    }
    getListOfTaskers(reqQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(reqQuery.longitude, reqQuery.latitude, reqQuery.services, reqQuery.maxDistance);
            if (reqQuery.services) {
                // check if service is exists in DB
                let isServiceExists = yield ServiceDao.getServiceById(reqQuery.services);
                if (!isServiceExists)
                    throw new HttpException(404, `Service ID ${reqQuery.services} doesn't exist in DB`);
            }
            let taskers = yield TaskerDao.listTaskers(reqQuery.longitude, reqQuery.latitude, reqQuery.services, reqQuery.maxDistance);
            return taskers;
        });
    }
    updateMyTaskerProfile(userId, tasker) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tasker.services)
                yield Promise.all(tasker.services.map((service) => __awaiter(this, void 0, void 0, function* () {
                    let serviceExists = yield ServiceDao.getServiceById(service);
                    if (!serviceExists)
                        throw new HttpException(404, `Service ID ${service} doesn't exist in DB`);
                    return service;
                })));
            return yield TaskerDao.updateTaskerByUserId(userId, tasker);
        });
    }
    deleteMyTaskerProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield TaskerDao.deleteTaskerByUserId(userId);
        });
    }
}
export { TaskerService };
