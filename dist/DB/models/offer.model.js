"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// task model implement the IOffer interface
const mongoose_1 = require("mongoose");
const interfaces_1 = require("../../interfaces");
let offerSchema = new mongoose_1.Schema({
    taskerId: {
        type: String,
        ref: 'Tasker',
        required: true,
    },
    taskId: {
        type: String,
        ref: 'Task',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: interfaces_1.OfferStatus,
        default: interfaces_1.OfferStatus.PENDING,
    },
    message: {
        type: String,
        trim: true,
        maxlength: 8000,
    },
    subMessages: [
        {
            userId: {
                type: String,
                ref: 'User',
                required: true,
            },
            message: {
                type: String,
                required: true,
                trim: true,
                maxlength: 8000,
            },
        },
    ],
}, { timestamps: true });
let Offer = (0, mongoose_1.model)('Offer', offerSchema);
exports.default = Offer;
