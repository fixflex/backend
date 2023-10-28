"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.server = void 0;
const http_1 = require("http");
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const app_1 = __importDefault(require("./app"));
const validateEnv_1 = __importDefault(require("./config/validateEnv"));
const routes_1 = require("./routes");
const routes_2 = require("./routes");
const routes_3 = require("./routes");
const chat_route_1 = require("./routes/chat.route");
const healthz_route_1 = __importDefault(require("./routes/healthz.route"));
const tasker_route_1 = require("./routes/users/tasker.route");
const socket_1 = __importDefault(require("./sockets/socket"));
const log_1 = __importDefault(require("./utils/log"));
// Setup routes
let authRoute = tsyringe_1.container.resolve(routes_2.AuthRoute);
let userRoute = tsyringe_1.container.resolve(routes_1.UserRoute);
let serviseRoute = tsyringe_1.container.resolve(routes_3.ServiceRoute);
let taskerRoute = tsyringe_1.container.resolve(tasker_route_1.TaskerRoute);
let healthzRoute = tsyringe_1.container.resolve(healthz_route_1.default);
let chatRoute = tsyringe_1.container.resolve(chat_route_1.ChatRoute);
// Setup app
let app = new app_1.default([healthzRoute, authRoute, userRoute, taskerRoute, serviseRoute, chatRoute]);
// Setup http server
let client = app.getServer();
exports.client = client;
let server = (0, http_1.createServer)(client);
exports.server = server;
// Setup socket server
let socket = new socket_1.default(server);
socket.initializeSocket();
server.listen(8080).on('listening', () => {
    log_1.default.info(`🚀 App listening in ${process.env.NODE_ENV} mode on the port ${validateEnv_1.default.PORT}`);
});
