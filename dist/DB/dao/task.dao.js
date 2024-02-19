"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskDao = void 0;
const helpers_1 = require("../../helpers");
const task_model_1 = __importDefault(require("../models/task.model"));
const baseDao_1 = __importDefault(require("./baseDao"));
class TaskDao extends baseDao_1.default {
    constructor() {
        super(task_model_1.default);
    }
    // override the getOneById method to populate the userId and offers and don't select the __v and the password
    // async getOneById(id: string) {
    //   //  make nested populate to populate the offers the taskerId for each offer
    //   return await this.model
    //     .findById(id)
    //     .populate({
    //       path: 'offers',
    //       populate: {
    //         path: 'taskId',
    //       },
    //     })
    //     .populate('userId', 'firstName lastName profilePicture')
    //     .select('-__v -password');
    // }
    async getTasks(query) {
        // console.log(query);
        const countDocments = await task_model_1.default.countDocuments();
        if (!query.status)
            query.status = { $nin: ['CANCELLED'] };
        let apiFeatures = new helpers_1.QueryBuilder(task_model_1.default.find(), query)
            .filter(['location', 'online', 'maxDistance'])
            .locationFilter()
            .search(['title', 'details'])
            .sort('-location.coordinates')
            .limitFields()
            .paginate(countDocments);
        const pagination = apiFeatures.pagination;
        const tasks = await apiFeatures.mongooseQuery
            // TODO: Make apiFeatures more generic to handle all the populate and select methods , by removing the select and populate methods from the apiFeatures and make them as a method in the QueryBuilder class
            .select('-__v  -images  -imageCover  -details')
            .populate('userId', 'firstName lastName  profilePicture');
        return { tasks, pagination };
    }
}
exports.TaskDao = TaskDao;
