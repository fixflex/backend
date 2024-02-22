"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDao = void 0;
const models_1 = require("../models");
const base_dao_1 = __importDefault(require("./base.dao"));
class MessageDao extends base_dao_1.default {
    constructor() {
        super(models_1.MessageModel);
    }
}
exports.MessageDao = MessageDao;
