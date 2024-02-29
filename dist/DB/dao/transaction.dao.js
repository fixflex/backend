"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionDao = void 0;
const transaction_model_1 = require("../models/transaction.model");
const base_dao_1 = __importDefault(require("./base.dao"));
class TransactionDao extends base_dao_1.default {
    // class TransactionDao extends BaseDAO<ITransactionDocument> { //  TODO Fix the generic type of the BaseDAO
    constructor() {
        super(transaction_model_1.TransactionModel);
    }
}
exports.TransactionDao = TransactionDao;
