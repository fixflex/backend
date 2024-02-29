"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["ONLINE_TASK_PAYMENT"] = "ONLINE_TASK_PAYMENT";
    TransactionType["PLATFORM_COMMISSION"] = "PLATFORM_COMMISSION";
    TransactionType["TASKER_WITHDRAWAL"] = "TASKER_WITHDRAWAL";
    TransactionType["VOID_TRANSACTION"] = "VOID_TRANSACTION";
    TransactionType["REFUND_TRANSACTION"] = "REFUND_TRANSACTION";
    TransactionType["COMMISSION_PAYMENT"] = "COMMISSION_PAYMENT";
    TransactionType["WITHDRAWAL"] = "WITHDRAWAL";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["ONLINE_PAYMENT"] = "ONLINE_PAYMENT";
    // CARD = 'CARD',
    // WALLET = 'WALLET',
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
