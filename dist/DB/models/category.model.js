"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Service schema
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
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
// Create the Service model
const Service = (0, mongoose_1.model)('Category', categorySchema);
exports.default = Service;
