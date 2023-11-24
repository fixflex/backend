"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Service schema
const serviceSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    image: String,
});
// Create the Service model
const Service = (0, mongoose_1.model)('Service', serviceSchema);
exports.default = Service;
