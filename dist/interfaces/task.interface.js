"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTime = exports.TaskStatus = void 0;
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["OPEN"] = "OPEN";
    TaskStatus["ASSIGNED"] = "ASSIGNED";
    TaskStatus["COMPLETED"] = "COMPLETED";
    // DONE = 'DONE',
    // IN_PROGRESS = 'IN_PROGRESS',
    // CANCELED = 'CANCELED',
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskTime;
(function (TaskTime) {
    TaskTime["MORNING"] = "MORNING";
    TaskTime["EVENING"] = "EVENING";
    TaskTime["NIGHT"] = "NIGHT";
})(TaskTime || (exports.TaskTime = TaskTime = {}));
