"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tasker_model_1 = __importDefault(require("../models/user/tasker.model"));
class TaskerDao {
    static async getTaskerByUserId(userId) {
        return await tasker_model_1.default.findOne({ userId }).lean();
    }
    static async listTaskers(longitude, latitude, services, maxDistance = 60) {
        let taskers;
        // /api/v1/taskers?longitude=35.5&latitude=33.5&services=cleaning&maxDistance=60
        if (latitude && longitude && services) {
            taskers = await tasker_model_1.default.find({
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
            taskers = await tasker_model_1.default.find({}).lean();
        return taskers;
    }
    static async create(user) {
        return await tasker_model_1.default.create(user);
    }
    static async updateTaskerByUserId(userId, tasker) {
        if (tasker.services) {
            // let services = tasker.services;
            // delete tasker.services;
            const { services, ...taskerWithoutServices } = tasker;
            return await tasker_model_1.default.findOneAndUpdate({ userId }, { $addToSet: { services }, ...taskerWithoutServices }, { new: true }).lean();
        }
        return tasker_model_1.default.findOneAndUpdate({ userId }, tasker, { new: true }).lean();
    }
    static async deleteTaskerByUserId(userId) {
        return await tasker_model_1.default.findOneAndDelete({ userId }).lean();
    }
}
exports.default = TaskerDao;
