"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let clientSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });
let Client = (0, mongoose_1.model)('Client', clientSchema);
exports.default = Client;
