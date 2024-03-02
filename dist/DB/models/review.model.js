"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = void 0;
const mongoose_1 = require("mongoose");
const tasker_model_1 = __importDefault(require("./tasker.model"));
let reviewSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true,
    },
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
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    review: {
        type: String,
        required: true,
    },
}, { timestamps: true });
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (taskerId) {
    let stats = await this.aggregate([
        {
            $match: { taskerId },
        },
        {
            $group: {
                _id: '$taskerId',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);
    console.log('stats ===>  ', stats);
    if (stats.length > 0) {
        await tasker_model_1.default.findByIdAndUpdate(taskerId, {
            ratingQuantity: stats[0].nRating,
            ratingAverage: stats[0].avgRating.toFixed(2),
        }, { new: true });
    }
};
// Call calcAverageRatingsAndQuantity after each review is created or updated
reviewSchema.post('save', async function () {
    // @ts-ignore // TODO : fix this error
    this.constructor.calcAverageRatingsAndQuantity(this.taskerId);
});
let ReviewModel = (0, mongoose_1.model)('Review', reviewSchema);
exports.ReviewModel = ReviewModel;
