"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
require("reflect-metadata");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const DB_1 = __importDefault(require("./DB"));
const validateEnv_1 = __importDefault(require("./config/validateEnv"));
// Documentation
const swagger_1 = __importDefault(require("./docs/swagger"));
const notFoundException_1 = require("./exceptions/notFoundException");
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
        this.app.use((0, cors_1.default)({ origin: true, credentials: true, exposedHeaders: ['set-cookie'] })); // for cross origin request (CORS) (for development) - allow all origins
        // this.app.use(cors({ origin: env.CLIENT_URL, credentials: true })); // for cross origin request (CORS) (for production) - allow specific origins
        // this.app.use(cors({ origin: env.CLIENT_URL, credentials: true, exposedHeaders: ['set-cookie'] })); // for cross origin request (CORS) (for production) - allow specific origins
        //  exposedHeaders: ['set-cookie']  means that the server can set the cookie in the response header and the client can read it from the response header
        this.app.use(express_1.default.json());
        // this.app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
        this.app.use((0, cookie_parser_1.default)());
        this.app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
        // i18next for internationalization (i18n)  (for multi language support)
        i18next_1.default
            .use(i18next_fs_backend_1.default)
            .use(i18next_http_middleware_1.default.LanguageDetector)
            .init({
            backend: {
                loadPath: path_1.default.join(__dirname, '../locales/{{lng}}/translation.json'),
                addPath: path_1.default.join(__dirname, '../locales/missing.json'), // this is where we save missing translations on-the-fly means when we use saveMissing: true it will save the missing keys in this file (for development)
            },
            fallbackLng: 'en',
            // preload: ['en', 'ar'], // preload all languages
            saveMissing: true,
            // debug: env.NODE_ENV === 'development', // sset debug to true to view missing keys in the log file (for development)
            detection: {
                order: ['header', 'cookie'],
                lookupHeader: 'accept-language',
                lookupCookie: 'accept-language',
                caches: ['cookie'], // cache the language in a cookie (for production)
            },
        });
        this.app.use(i18next_http_middleware_1.default.handle(i18next_1.default));
        // to access the translations file you can use req.t('key') or req.t('namespace:key') if you have namespaces in your translations file
        // the namespace is the file name without the extension for example if you have a file named translation.json the namespace is translation then you can use req.t('translation:key')
        // to be shure that you use the correct key you can use the i18next editor extension for vscode
    }
    initializeRoutes(routes) {
        routes.forEach(route => {
            this.app.use('/api/v1', route.router);
        });
    }
    initializeSwagger() {
        if (this.env !== 'production') {
            this.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
        }
    }
    initializeErrorHandling() {
        this.app.use(notFoundException_1.notFound);
        this.app.use(errors_1.errorMiddleware);
    }
}
exports.default = App;
