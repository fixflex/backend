"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponModel = void 0;
const mongoose_1 = require("mongoose");
const interfaces_1 = require("../../interfaces");
const couponSchema = new mongoose_1.Schema({
    code: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(interfaces_1.CouponType),
        default: interfaces_1.CouponType.PERCENTAGE,
    },
    value: {
        // example: 10 for 10% or 100 for 100$
        type: Number,
        required: true,
    },
    expirationDate: {
        type: Date,
        required: true,
        // default: new Date() + 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    maxUses: {
        type: Number,
        required: true,
    },
    remainingUses: {
        type: Number,
        required: true,
    },
    minOrderAmount: {
        // minimum order amount required to apply the coupon
        type: Number,
    },
    createdBy: {
        // the admin who created the coupon
        type: String,
        required: true,
    },
}, { timestamps: true });
const CouponModel = (0, mongoose_1.model)('Coupon', couponSchema);
exports.CouponModel = CouponModel;
