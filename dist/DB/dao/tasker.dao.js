"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tasker_model_1 = __importDefault(require("../models/user/tasker.model"));
const commonDAO_1 = __importDefault(require("./commonDAO"));
class TaskerDao extends commonDAO_1.default {
    constructor() {
        super(tasker_model_1.default);
    }
    async listTaskers(longitude, latitude, services, maxDistance = 60) {
        let taskers;
        // /api/v1/taskers?longitude=35.5&latitude=33.5&services=6560fabd6f972e1d74a71242&maxDistance=60
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
        else if (services) {
            taskers = await tasker_model_1.default.find({
                // where services = service
                services: { $eq: services },
            }).lean();
        }
        else if (latitude && longitude) {
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
            }).lean();
        }
        else
            taskers = await tasker_model_1.default.find({}).lean();
        return taskers;
    }
    // get tasker profile with user data and services data
    async getTaskerProfile(taskerId) {
        let tasker = await tasker_model_1.default.findById(taskerId).populate('userId', 'firstName lastName email phoneNumber').populate('services', '_id name description').lean();
        return tasker;
    }
}
exports.default = TaskerDao;
