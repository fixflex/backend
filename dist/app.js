"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
require("reflect-metadata");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const DB_1 = __importDefault(require("./DB"));
const validateEnv_1 = __importDefault(require("./config/validateEnv"));
const swagger_json_1 = __importDefault(require("./docs/swagger.json"));
const notFound_1 = require("./exceptions/notFound");
require("./exceptions/shutdownHandler");
const errors_1 = require("./middleware/errors");
class App {
    constructor(routes) {
        this.app = (0, express_1.default)();
        this.port = validateEnv_1.default.PORT || 8000;
        this.env = process.env.NODE_ENV || 'development';
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeSwagger();
        this.initializeErrorHandling();
    }
    getServer() {
        return this.app;
    }
    connectToDatabase() {
        (0, DB_1.default)();
    }
    initializeMiddlewares() {
        if (this.env === 'development') {
            this.app.use((0, morgan_1.default)('dev'));
        }
        this.app.use(express_1.default.json());
    }
    initializeRoutes(routes) {
        routes.forEach(route => {
            this.app.use('/api/v1', route.router);
        });
    }
    initializeSwagger() {
        if (this.env !== 'production') {
            this.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
        }
    }
    initializeErrorHandling() {
        this.app.use(notFound_1.notFound);
        this.app.use(errors_1.errorMiddleware);
    }
}
exports.default = App;
