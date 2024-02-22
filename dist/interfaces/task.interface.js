"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTime = exports.TaskStatus = void 0;
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["OPEN"] = "OPEN";
    TaskStatus["ASSIGNED"] = "ASSIGNED";
    TaskStatus["COMPLETED"] = "COMPLETED";
    TaskStatus["CANCELLED"] = "CANCELLED";
    // DONE = 'DONE',
    // IN_PROGRESS = 'IN_PROGRESS',
    // CANCELED = 'CANCELED',
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
// type Address = {
//   apartment: string;
//   floor: string;
//   building: string;
//   street: string;
//   city: string;
//   country: string;
//   state: string;
//   zip_code: string;
// };
var TaskTime;
(function (TaskTime) {
    TaskTime["MORNING"] = "MORNING";
    TaskTime["MIDDAY"] = "MIDDAY";
    TaskTime["AFTERNOON"] = "AFTERNOON";
    TaskTime["EVENING"] = "EVENING";
})(TaskTime || (exports.TaskTime = TaskTime = {}));
