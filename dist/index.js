"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.client = exports.server = void 0;
const http_1 = require("http");
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const app_1 = __importDefault(require("./app"));
const validateEnv_1 = __importDefault(require("./config/validateEnv"));
const log_1 = __importDefault(require("./helpers/log"));
const routes_1 = require("./routes");
const routes_2 = require("./routes");
const routes_3 = require("./routes");
const routes_4 = require("./routes");
const chat_route_1 = require("./routes/chat.route");
const coupon_route_1 = require("./routes/coupon.route");
const healthz_route_1 = __importDefault(require("./routes/healthz.route"));
const offer_route_1 = require("./routes/offer.route");
const review_route_1 = require("./routes/review.route");
const task_route_1 = require("./routes/task.route");
const tasker_route_1 = require("./routes/tasker.route");
const webhooks_route_1 = require("./routes/webhooks.route");
const socket_1 = require("./sockets/socket");
// Setup routes
let authRoute = tsyringe_1.container.resolve(routes_2.AuthRoute);
let userRoute = tsyringe_1.container.resolve(routes_1.UserRoute);
let categoryRoute = tsyringe_1.container.resolve(routes_3.CategoryRoute);
let taskerRoute = tsyringe_1.container.resolve(tasker_route_1.TaskerRoute);
let healthzRoute = tsyringe_1.container.resolve(healthz_route_1.default);
let chatRoute = tsyringe_1.container.resolve(chat_route_1.ChatRoute);
let messageRoute = tsyringe_1.container.resolve(routes_4.MessageRoute);
let taskRoute = tsyringe_1.container.resolve(task_route_1.TaskRoute);
let offerRoute = tsyringe_1.container.resolve(offer_route_1.OfferRoute);
let couponRoute = tsyringe_1.container.resolve(coupon_route_1.CouponRoute);
let webhooksRoute = tsyringe_1.container.resolve(webhooks_route_1.WebhooksRoute);
let reviewRouite = tsyringe_1.container.resolve(review_route_1.ReviewRoute);
// Setup app
let app = new app_1.default([
    healthzRoute,
    authRoute,
    userRoute,
    taskerRoute,
    categoryRoute,
    chatRoute,
    taskRoute,
    offerRoute,
    couponRoute,
    messageRoute,
    webhooksRoute,
    reviewRouite,
]);
// Setup http server
let client = app.getServer();
exports.client = client;
let server = (0, http_1.createServer)(client);
exports.server = server;
let s = server.listen(validateEnv_1.default.PORT).on('listening', () => {
    log_1.default.info(`🚀 App listening in ${validateEnv_1.default.NODE_ENV} mode on the port ${validateEnv_1.default.PORT}`);
});
// Setup socket server
let socketService = socket_1.SocketService.getInstance(s);
let io = socketService.getSocketIO();
exports.io = io;
