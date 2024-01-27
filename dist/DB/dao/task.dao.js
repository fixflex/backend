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
    async getTasks(query) {
        const countDocments = await task_model_1.default.countDocuments();
        let apiFeatures = new helpers_1.QueryBuilder(task_model_1.default.find(), query)
            .filter(['location', 'online', 'maxDistance'])
            .locationFilter()
            .search(['title', 'details'])
            .sort()
            .limitFields()
            .paginate(countDocments);
        console.log(apiFeatures.mongooseQuery.getQuery());
        const pagination = apiFeatures.pagination;
        const tasks = await apiFeatures.mongooseQuery;
        return { tasks, pagination };
    }
}
exports.TaskDao = TaskDao;
// async getTasks(query: Query) {
//   const tasks = await TaskModel.find( )
//   return tasks;
// }
// const tasks = await TaskModel.find(query);
// // .populate('ownerId', 'firstName lastName email profilePicture')
// // .populate('taskerId', 'firstName lastName email profilePicture')
// // .populate('categories', 'name')
// // .populate('chatId', 'messages');
