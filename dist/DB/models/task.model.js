"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const interfaces_1 = require("../../interfaces");
const transaction_interface_1 = require("../../interfaces/transaction.interface");
let taskSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true,
    },
    // taskerId: {
    //   type: String,
    //   ref: 'Tasker',
    // },
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
    categoryId: {
        type: String,
        ref: 'Category',
    },
    status: {
        type: String,
        enum: Object.values(interfaces_1.TaskStatus),
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
        },
        online: {
            type: Boolean,
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
    offers: [
        {
            type: String,
            ref: 'Offer',
        },
    ],
    acceptedOffer: {
        type: String,
        ref: 'Offer',
    },
    // ======================================================================================================== //
    transcactionId: {
        type: String,
        ref: 'Transaction',
    },
    paymentMethod: {
        type: String,
        enum: Object.values(transaction_interface_1.PaymentMethod),
        default: transaction_interface_1.PaymentMethod.CASH,
        // card: {
        //   cardNumber: String,
        //   cardHolderName: String,
        //   expiryDate: String,
        //   cvc: String,
        // },
        // vodafoneCash: {
        //   phoneNumber: String,
        //   pin: String,
        // },
    },
    commission: {
        type: Number,
        // default: 0,
    },
    commissionAfterDescount: {
        type: Number,
        // default: 0,
    },
}, { timestamps: true });
// Apply the geospatial index to the coordinates field inside the location object
// taskSchema.index({ 'location.coordinates': '2dsphere' });
taskSchema.index({ location: '2dsphere' });
let Task = (0, mongoose_1.model)('Task', taskSchema);
exports.default = Task;
// TODO
//=====================================================
// Query executed without index
// This query ran without an index.
// If you plan on using this query heavily in your application,
// you should create an index that covers this query.
//=====================================================
