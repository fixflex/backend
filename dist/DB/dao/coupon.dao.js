"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponDao = void 0;
const models_1 = require("../models");
const base_dao_1 = __importDefault(require("./base.dao"));
class CouponDao extends base_dao_1.default {
    constructor() {
        super(models_1.CouponModel);
    }
}
exports.CouponDao = CouponDao;
