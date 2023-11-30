"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskDao = void 0;
const task_model_1 = __importDefault(require("../models/task/task.model"));
const commonDAO_1 = __importDefault(require("./commonDAO"));
class TaskDao extends commonDAO_1.default {
    constructor() {
        super(task_model_1.default);
    }
}
exports.TaskDao = TaskDao;
