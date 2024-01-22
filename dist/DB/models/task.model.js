"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const interfaces_1 = require("../../interfaces");
let taskSchema = new mongoose_1.Schema({
    ownerId: {
        type: String,
        ref: 'User',
        required: true,
    },
    dueDate: {
        start: {
            type: Date,
        },
        end: {
            type: Date,
        },
        flexible: {
            type: Boolean,
        },
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    details: {
        type: String,
        required: true,
        trim: true,
        maxlength: 8000,
    },
    imageCover: {
        url: String,
        publicId: {
            type: String,
            default: null,
        },
    },
    // TODO: check the max length of the images array should't be more than 5
    images: [
        {
            url: String,
            publicId: {
                type: String,
                default: null,
            },
        },
    ],
    service: {
        type: String,
        ref: 'Service',
    },
    status: {
        type: String,
        enum: interfaces_1.TaskStatus,
        default: interfaces_1.TaskStatus.OPEN,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    // city: {
    //   type: String,
    //   trim: true,
    //   maxlength: 50,
    // },
    price: {
        type: Number,
        required: true,
        min: 5,
    },
    offer: {
        type: String,
        ref: 'Offer',
    },
}, { timestamps: true });
// Apply the geospatial index to the coordinates field inside the location object
// taskSchema.index({ 'location.coordinates': '2dsphere' });
taskSchema.index({ location: '2dsphere' });
let Task = (0, mongoose_1.model)('Task', taskSchema);
exports.default = Task;
