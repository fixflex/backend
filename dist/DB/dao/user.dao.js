"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const baseDao_1 = __importDefault(require("./baseDao"));
class UserDao extends baseDao_1.default {
    constructor() {
        super(user_model_1.default);
    }
    async getUserByEmail(email) {
        return await user_model_1.default.findOne({ email: email });
    }
    async listUsers(query = {}, paginate, sort = {}, select = '-__v') {
        // build the query
        let users = user_model_1.default.find(query);
        if (paginate.skip)
            users = users.skip(paginate.skip);
        if (paginate.limit)
            users = users.limit(paginate.limit);
        users = users.sort(sort).select(select);
        // execute the query
        return await users.lean();
    }
}
exports.default = UserDao;
