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
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
require("reflect-metadata");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const whatsapp_web_js_1 = require("whatsapp-web.js");
const DB_1 = require("./DB");
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
        this.initializeWhatsAppWeb();
        this.initializeSwagger();
        this.initializeErrorHandling();
    }
    getServer() {
        return this.app;
    }
    connectToDatabase() {
        (0, DB_1.dbConnection)();
    }
    initializeMiddlewares() {
        if (this.env === 'development') {
            this.app.use((0, morgan_1.default)('dev'));
        }
        this.app.use((0, cors_1.default)({ origin: true, credentials: true, exposedHeaders: ['set-cookie'] }));
        this.app.use(express_1.default.json());
        this.app.use((0, cookie_parser_1.default)());
        if (this.env !== 'production')
            this.app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
        i18next_1.default
            .use(i18next_fs_backend_1.default)
            .use(i18next_http_middleware_1.default.LanguageDetector)
            .init({
            backend: {
                loadPath: path_1.default.join(__dirname, '../locales/{{lng}}/translation.json'),
                addPath: path_1.default.join(__dirname, '../locales/missing.json'),
            },
            fallbackLng: validateEnv_1.default.defaultLocale,
            saveMissing: true,
            detection: {
                // TODO: get the language from the user's browser
                order: ['header', 'cookie'],
                lookupHeader: 'accept-language',
                lookupCookie: 'accept-language',
                caches: ['cookie'], // cache the language in a cookie
            },
            // preload: ['en', 'ar'], // preload all languages
            // debug: env.NODE_ENV === 'development',
        });
        this.app.use(i18next_http_middleware_1.default.handle(i18next_1.default));
    }
    initializeWhatsAppWeb() {
        this.whatsappclient = new whatsapp_web_js_1.Client({
            authStrategy: new whatsapp_web_js_1.LocalAuth(),
        });
        this.whatsappclient.on('qr', (qr) => qrcode_terminal_1.default.generate(qr, { small: true }));
        this.whatsappclient.on('ready', () => {
            console.log('Client is ready!');
            global['myGlobalVar'] = true;
        });
        this.whatsappclient.on('authenticated', () => console.log('Authenticated'));
        this.whatsappclient.on('message', async (message) => {
            try {
                // process.env.PROCCESS_MESSAGE_FROM_CLIENT &&
                if (message.from != 'status@broadcast') {
                    const contact = await message.getContact();
                    console.log(contact.pushname, message.from);
                    // console.log(message.from);
                    if (message.body === 'ping') {
                        await message.reply('pong');
                        await this.whatsappclient.sendMessage(message.from, 'pong');
                    }
                    else {
                        // to generate random emoji using the following code :
                        // const emoji = String.fromCodePoint(0x1f601 + Math.floor(Math.random() * 50));
                        // console.log(emoji);
                        // console.log(message);
                        await this.whatsappclient.sendMessage(message.from, `👋 Hello ${message._data.notifyName}` +
                            "\n\nNeed help or have questions? Don't hesitate to reach out to our dedicated customer service team – they're here for you!\n📞 Call [phone number] or email [email address] for assistance."
                        // "\n🌟 If you have any questions or need assistance, please don't hesitate to reach out to our dedicated customer service team. They're here to help you every step of the way!. They're ready to help! Call [phone number] or email [email address]. We're here for you!"
                        );
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
        });
        this.whatsappclient.initialize();
    }
    initializeRoutes(routes) {
        // serve the static files (index.html)
        // if (this.env !== 'production') {
        //   this.app.use(express.static(path.join(__dirname, '../public')));
        // }
        //   🤬😡😡🤬 يحمااااار
        // this.app.use('/api/v1/callback', (req, res) => {
        //   // log the request body
        //   console.log(req.body);
        //   // return the response
        //   res.status(200).json({ message: 'callback received' });
        // });
        routes.forEach(route => {
            this.app.use('/api/v1', route.router);
        });
    }
    initializeSwagger() {
        if (this.env !== 'production') {
            // this.app.use('/api-docs/saddamarbaa/', swaggerUi.serve, swaggerUi.setup(swaggerSaddamarbaa));
            this.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
        }
    }
    initializeErrorHandling() {
        this.app.use(notFoundException_1.notFound);
        this.app.use(errors_1.errorMiddleware);
    }
}
exports.default = App;
