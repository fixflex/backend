"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// task model implement the IOffer interface
const mongoose_1 = require("mongoose");
let offerSchema = new mongoose_1.Schema({
    taskerId: {
        type: String,
        ref: 'User',
        required: true,
    },
    taskId: {
        type: String,
        ref: 'Offer',
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 6000,
    },
    subMessages: [
        {
            sender: {
                type: String,
                ref: 'User',
                required: true,
            },
            message: {
                type: String,
                required: true,
                trim: true,
                maxlength: 6000,
            },
        },
    ],
    images: [
        {
            url: String,
            publicId: String,
        },
    ],
}, { timestamps: true });
let Offer = (0, mongoose_1.model)('Offer', offerSchema);
exports.default = Offer;
