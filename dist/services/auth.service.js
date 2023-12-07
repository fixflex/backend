"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServie = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const tsyringe_1 = require("tsyringe");
const user_dao_1 = __importDefault(require("../DB/dao/user.dao"));
const validateEnv_1 = __importDefault(require("../config/validateEnv"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const createToken_1 = require("../utils/createToken");
const hashing_1 = require("../utils/hashing");
let AuthServie = exports.AuthServie = class AuthServie {
    constructor(userDao) {
        this.userDao = userDao;
    }
    /**
     * Signup a new user
     * @param user - The user object to signup
     * @returns An object containing the newly created user and a token
     * @throws HttpException if the email or username already exists
     */
    async signup(user) {
        // check if the user already exists
        let isEmailExists = await this.userDao.getUserByEmail(user.email);
        if (isEmailExists) {
            throw new HttpException_1.default(409, `E-Mail address ${user.email} is already exists, please pick a different one.`);
        }
        // hash the password
        user.password = await bcrypt_1.default.hash(user.password, validateEnv_1.default.SALT_ROUNDS);
        let newUser = await this.userDao.create(user);
        let token = (0, createToken_1.createToken)(newUser._id);
        return { user: newUser, token };
    }
    async login(email, password) {
        let user;
        if (!email || !password) {
            throw new HttpException_1.default(400, 'Email and password are required');
        }
        user = await this.userDao.getUserByEmail(email);
        if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
            throw new HttpException_1.default(401, 'Incorrect email or password');
        }
        let token = (0, createToken_1.createToken)(user._id);
        return { user, token };
    }
    async forgotPassword(email) {
        // comments in details for the reset password route
        // 1- check if the user exists by email
        let user = await this.userDao.getUserByEmail(email, false);
        if (!user) {
            throw new HttpException_1.default(404, 'User not found');
        }
        // 2- generate a reset code
        const resetCode = Math.floor(100000 + Math.random() * 90000).toString();
        // 3- hash the reset code via crypto
        user.passwordResetCode = (0, hashing_1.hashCode)(resetCode);
        // 3- set the reset code expiration to 10 minutes
        user.passwordResetCodeExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes
        // 4- set the passwordResetVerified to false
        user.passwordResetVerified = false;
        // 5- update the user document with the hashed reset code and the reset code expiration the passwordResetVerified
        await user.save();
        // 5- send the reset code to the user email address using nodemailer
        // 6- return the reset code to the user
        return resetCode;
        // TODO: log the user out from all devices (delete all the refresh tokens from the database for this user id and set the passwordChangedAt to now so all the refresh tokens will be invalid)
    }
};
exports.AuthServie = AuthServie = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [user_dao_1.default])
], AuthServie);
