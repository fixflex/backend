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
    taskerId: {
        type: String,
        ref: 'Tasker',
    },
    dueDate: {
        on: {
            type: Date,
        },
        before: {
            type: Date,
        },
        flexible: {
            type: Boolean,
        },
    },
    time: [
        {
            type: String,
            enum: interfaces_1.TaskTime,
        },
    ],
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
    category: {
        type: String,
        ref: 'Category',
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
            default: [0, 0],
        },
        online: {
            type: Boolean,
            default: false,
        },
    },
    // city: {
    //   type: String,
    //   trim: true,
    //   maxlength: 50,
    // },
    budget: {
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
