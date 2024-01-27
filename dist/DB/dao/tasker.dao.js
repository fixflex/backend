"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tasker_model_1 = __importDefault(require("../models/tasker.model"));
const baseDao_1 = __importDefault(require("./baseDao"));
class TaskerDao extends baseDao_1.default {
    constructor() {
        super(tasker_model_1.default);
    }
    async listTaskers(longitude, latitude, categories, maxDistance = 60) {
        let taskers;
        // /api/v1/taskers?longitude=35.5&latitude=33.5&categories=6560fabd6f972e1d74a71242&maxDistance=60
        if (latitude && longitude && categories) {
            taskers = await tasker_model_1.default.find({
                location: {
                    $near: {
                        $maxDistance: maxDistance * 1000,
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude], // [longitude, latitude] [y, x]
                        },
                    },
                },
                // where categories = service
                categories: { $eq: categories },
            })
                .populate('userId', 'firstName lastName email  profilePicture')
                .populate('categories', 'name')
                .lean();
        }
        else if (categories) {
            taskers = await tasker_model_1.default.find({
                // where categories = service
                categories: { $eq: categories },
            })
                .populate('userId', 'firstName lastName email  profilePicture')
                .populate('categories', 'name')
                .lean();
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
            })
                .populate('userId', 'firstName lastName email  profilePicture')
                .populate('categories', 'name')
                .lean();
        }
        else
            taskers = await tasker_model_1.default.find({})
                .populate('userId', 'firstName lastName email  profilePicture')
                .populate('categories', 'name')
                .lean();
        return taskers;
    }
    // get tasker profile with user data and categories data
    async getTaskerProfile(taskerId) {
        let tasker = await tasker_model_1.default.findById(taskerId)
            .populate('userId', 'firstName lastName email profilePicture')
            .populate('categories', '_id name')
            .lean();
        return tasker;
    }
}
exports.default = TaskerDao;
