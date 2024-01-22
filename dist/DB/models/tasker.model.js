"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let taskerSchema = new mongoose_1.Schema({
    userId: {
        unique: true,
        type: String,
        ref: 'User',
        required: true,
    },
    categories: [
        {
            type: String,
            ref: 'Category',
        },
    ],
    rating: {
        type: Number,
        max: 5,
        min: 0,
        default: 0,
    },
    completedTasks: {
        type: Number,
        default: 0,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            // [longitude, latitude] [x, y]
            type: [Number],
            default: [0, 0],
        },
        radius: {
            type: Number,
            default: 0,
        },
    },
    bio: String,
    phoneNumber: {
        unique: true,
        type: String,
        required: true,
        minlength: 11,
        maxlength: 11,
    },
}, { timestamps: true });
// Apply the geospatial index to the coordinates field inside the location object
// taskerSchema.index({ 'location.coordinates': '2dsphere' });
taskerSchema.index({ location: '2dsphere' });
let Tasker = (0, mongoose_1.model)('Tasker', taskerSchema);
exports.default = Tasker;
