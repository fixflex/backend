"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const envalid_1 = require("envalid");
if (process.env.NODE_ENV === 'testing') {
    (0, dotenv_1.config)({ path: '.env.test' });
}
else {
    (0, dotenv_1.config)();
}
const validateEnv = (0, envalid_1.cleanEnv)(process.env, {
    PORT: (0, envalid_1.port)(),
    SOCKET_PORT: (0, envalid_1.port)(),
    NODE_ENV: (0, envalid_1.str)(),
    BASE_URL: (0, envalid_1.url)(),
    DB_URI: (0, envalid_1.str)(),
    JWT_SECRET_KEY: (0, envalid_1.str)(),
    JWT_EXPIRATION: (0, envalid_1.str)(),
    CLOUDINARY_API_SECRET: (0, envalid_1.str)(),
    CLOUDINARY_API_KEY: (0, envalid_1.str)(),
    CLOUDINARY_CLOUD_NAME: (0, envalid_1.str)(),
});
exports.default = validateEnv;
