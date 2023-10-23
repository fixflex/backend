var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import TaskerModel from '../models/user/tasker.model';
class TaskerDao {
    static getTaskerByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield TaskerModel.findOne({ userId }).lean();
        });
    }
    static listTaskers(longitude, latitude, services, maxDistance = 60) {
        return __awaiter(this, void 0, void 0, function* () {
            let taskers;
            console.log(longitude, latitude, services, maxDistance);
            if (latitude && longitude && services) {
                taskers = yield TaskerModel.find({
                    location: {
                        $near: {
                            $maxDistance: maxDistance * 1000,
                            $geometry: {
                                type: 'Point',
                                coordinates: [longitude, latitude], // [longitude, latitude] [x, y]
                            },
                        },
                    },
                    // where services = service
                    services: { $eq: services },
                }).lean();
            }
            else
                taskers = yield TaskerModel.find({}).lean();
            return taskers;
        });
    }
    static create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield TaskerModel.create(user);
        });
    }
    static updateTaskerByUserId(userId, tasker) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tasker.services) {
                // let services = tasker.services;
                // delete tasker.services;
                const { services } = tasker, taskerWithoutServices = __rest(tasker, ["services"]);
                console.log(services);
                return yield TaskerModel.findOneAndUpdate({ userId }, Object.assign({ $addToSet: { services } }, taskerWithoutServices), { new: true }).lean();
            }
            return TaskerModel.findOneAndUpdate({ userId }, tasker, { new: true }).lean();
        });
    }
    static deleteTaskerByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield TaskerModel.findOneAndDelete({ userId }).lean();
        });
    }
}
export default TaskerDao;
