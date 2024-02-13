"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./auth.route"), exports);
__exportStar(require("./chat.route"), exports);
__exportStar(require("./healthz.route"), exports);
__exportStar(require("./message.route"), exports);
__exportStar(require("./offer.route"), exports);
__exportStar(require("./category.route"), exports);
__exportStar(require("./task.route"), exports);
__exportStar(require("./tasker.route"), exports);
__exportStar(require("./user.route"), exports);
__exportStar(require("./coupon.route"), exports);
// export * from './admin.route';
