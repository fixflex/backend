"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskDao = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const baseDao_1 = __importDefault(require("./baseDao"));
class TaskDao extends baseDao_1.default {
    constructor() {
        super(task_model_1.default);
    }
    async getTasks(query) {
        const tasks = await task_model_1.default.find(query)
            .populate('ownerId', 'firstName lastName email profilePicture')
            .populate('taskerId', 'firstName lastName email profilePicture')
            .populate('categories', 'name')
            .populate('chatId', 'messages');
        return tasks;
    }
}
exports.TaskDao = TaskDao;
