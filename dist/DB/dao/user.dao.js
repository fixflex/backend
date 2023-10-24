"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user/user.model"));
class UserDao {
    static async getUserByUsername(emailOrUsername) {
        return await user_model_1.default.findOne({ username: emailOrUsername }).lean();
    }
    static async getUserByEmail(emailOrUsername) {
        return await user_model_1.default.findOne({ email: emailOrUsername }).lean();
    }
    static async getUserById(userId) {
        return await user_model_1.default.findById(userId).lean();
    }
    static async listUsers(query = {}, paginate, sort = {}, select = '-__v') {
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
    static async create(user) {
        return await user_model_1.default.create(user);
    }
    static async update(userId, user) {
        return await user_model_1.default.findByIdAndUpdate(userId, user, { new: true }).lean();
    }
    static async delete(userId) {
        return await user_model_1.default.findByIdAndDelete(userId).lean();
    }
}
exports.default = UserDao;
