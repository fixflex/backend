"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// disable the warning of mongoose-unique-validator package , it's don't have types yet
// @ts-ignore
const mongoose_i18n_localize_1 = __importDefault(require("mongoose-i18n-localize"));
const validateEnv_1 = __importDefault(require("../../config/validateEnv"));
// Define the Service schema
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        i18n: true,
        required: true,
    },
    description: String,
    image: {
        url: String,
        publicId: {
            type: String,
            default: null,
        },
    },
});
categorySchema.plugin(mongoose_i18n_localize_1.default, { locales: ['en', 'ar'], defaultLocale: validateEnv_1.default.defaultLocale });
// Create the Service model
const Service = (0, mongoose_1.model)('Category', categorySchema);
exports.default = Service;
