"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.server = void 0;
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const app_1 = __importDefault(require("./app"));
const routes_1 = require("./routes");
const routes_2 = require("./routes");
const routes_3 = require("./routes");
const tasker_route_1 = require("./routes/users/tasker.route");
let authRoute = tsyringe_1.container.resolve(routes_2.AuthRoute);
let userRoute = tsyringe_1.container.resolve(routes_1.UserRoute);
let serviseRoute = tsyringe_1.container.resolve(routes_3.ServiceRoute);
let taskerRoute = tsyringe_1.container.resolve(tasker_route_1.TaskerRoute);
let app = new app_1.default([authRoute, userRoute, serviseRoute, taskerRoute]);
let server = app.listen();
exports.server = server;
let client = app.getServer();
exports.client = client;
