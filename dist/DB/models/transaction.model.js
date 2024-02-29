"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("../../interfaces/transaction.interface");
let transactionSchema = new mongoose_1.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    transactionType: {
        type: String,
        enum: transaction_interface_1.TransactionType,
        required: true,
    },
    pinding: {
        type: Boolean,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    taskId: {
        type: String,
        ref: 'Task',
    },
    taskerId: {
        type: String,
        ref: 'Tasker',
    },
}, { timestamps: true });
let TransactionModel = (0, mongoose_1.model)('Transaction', transactionSchema);
exports.TransactionModel = TransactionModel;
