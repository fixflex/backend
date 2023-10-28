"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServie = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_dao_1 = __importDefault(require("../DB/dao/user.dao"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const createToken_1 = require("../utils/createToken");
class AuthServie {
    /**
     * Signup a new user
     * @param user - The user object to signup
     * @returns An object containing the newly created user and a token
     * @throws HttpException if the email or username already exists
     */
    async signup(user) {
        // check if the user already exists
        let isEmailExists = await user_dao_1.default.getUserByEmail(user.email);
        if (isEmailExists) {
            throw new HttpException_1.default(409, `E-Mail address ${user.email} is already exists, please pick a different one.`);
        }
        // hash the password
        user.password = await bcrypt_1.default.hash(user.password, 10);
        let newUser = await user_dao_1.default.create(user);
        let token = (0, createToken_1.createToken)(newUser._id);
        return { user: newUser, token };
    }
    async login(email, password) {
        let user;
        if (!email || !password) {
            throw new HttpException_1.default(400, 'Email and password are required');
        }
        user = await user_dao_1.default.getUserByEmail(email);
        if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
            throw new HttpException_1.default(401, 'Incorrect email or password');
        }
        let token = (0, createToken_1.createToken)(user._id);
        return { user, token };
    }
}
exports.AuthServie = AuthServie;
