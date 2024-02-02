"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskerDao = void 0;
const helpers_1 = require("../../helpers");
const tasker_model_1 = __importDefault(require("../models/tasker.model"));
const baseDao_1 = __importDefault(require("./baseDao"));
class TaskerDao extends baseDao_1.default {
    constructor() {
        super(tasker_model_1.default);
    }
    async getTaskers(query) {
        const countDocments = await tasker_model_1.default.countDocuments();
        let apiFeatures = new helpers_1.QueryBuilder(tasker_model_1.default.find(), query)
            .filter(['location', 'maxDistance'])
            .locationFilter()
            .search(['bio'])
            .sort()
            .limitFields()
            .paginate(countDocments);
        const pagination = apiFeatures.pagination;
        const taskers = await apiFeatures.mongooseQuery
            .select('-__v  -availability  -isVerified -workingHours  -phoneNumber  -location')
            .populate('userId', 'firstName lastName  profilePicture');
        return { taskers, pagination };
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
exports.TaskerDao = TaskerDao;
