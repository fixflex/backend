"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionType = exports.PaymentMethod = exports.TransactionStatus = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["PAYMENT"] = "PAYMENT";
    TransactionType["COMMISSION"] = "COMMISSION";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["PAID"] = "PAID";
    TransactionStatus["FAILED"] = "FAILED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["WALLET"] = "WALLET";
    // VODAFONE_CASH = 'VODAFONE_CASH',
    // ETISALAT_CASH = 'ETISALAT_CASH',
    // ORANGE_CASH = 'ORANGE_CASH',
    // FAWRY = 'FAWRY',
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var CommissionType;
(function (CommissionType) {
    CommissionType["PLATEFORM"] = "PLATEFORM";
    CommissionType["TASKER"] = "TASKER";
})(CommissionType || (exports.CommissionType = CommissionType = {}));
// payment: {
//   // method: PaymentMethod;
//   // card: {
//   //   cardNumber: string;
//   //   cardHolderName: string;
//   //   expiryDate: string;
//   //   cvc: string;
//   // };
//   // vodafoneCash: {
//   //   phoneNumber: string;
//   //   pin: string;
//   // };
//   status: PaymentStatus;
//   amount: number;
//   transactionId: string;
// };
