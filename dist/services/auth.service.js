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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tsyringe_1 = require("tsyringe");
const user_dao_1 = __importDefault(require("../DB/dao/user.dao"));
const validateEnv_1 = __importDefault(require("../config/validateEnv"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const createToken_1 = require("../helpers/createToken");
const hashing_1 = require("../helpers/hashing");
const nodemailer_1 = require("../helpers/nodemailer");
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
        let accessToken = (0, createToken_1.createAccessToken)(newUser._id);
        let refreshToken = (0, createToken_1.createAccessToken)(newUser._id);
        return { user: newUser, accessToken, refreshToken };
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
        let accessToken = (0, createToken_1.createAccessToken)(user._id);
        let refreshToken = (0, createToken_1.createRefreshToken)(user._id);
        return { user, accessToken, refreshToken };
    }
    async googleLogin(authorizationCode) {
        // 1. get the user data using jwt
        const decoded = jsonwebtoken_1.default.decode(authorizationCode);
        // 2. check if the user exists
        let user = await this.userDao.getUserByEmail(decoded.email);
        // 3. if the user exists, return the user and the token (login)
        if (user) {
            let accessToken = (0, createToken_1.createAccessToken)(user._id);
            let refreshToken = (0, createToken_1.createRefreshToken)(user._id);
            return { user, accessToken, refreshToken };
        }
        // 4. if the user does not exist, create a new user and return the user and the token (signup)
        let newUser = await this.userDao.create({
            email: decoded.email,
            emailVerified: decoded.email_verified,
            firstName: decoded.given_name,
            lastName: decoded.family_name,
            profilePicture: { url: decoded.picture, publicId: null },
        });
        if (!newUser) {
            throw new HttpException_1.default(500, 'Something went wrong');
        }
        let accessToken = (0, createToken_1.createAccessToken)(newUser._id);
        let refreshToken = (0, createToken_1.createAccessToken)(newUser._id);
        return { user: newUser, accessToken, refreshToken };
    }
    async refreshToken(refreshToken) {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, validateEnv_1.default.REFRESH_TOKEN_SECRET_KEY);
        // 3- check if the user still exists
        const user = await this.userDao.getOneById(decoded.userId);
        // 4- check if the user changed his password after the token was issued
        // TODO: make this check in the user model instead of here
        if (user.passwordChangedAt && user.passwordChangedAt.getTime() / 1000 > decoded.iat) {
            throw new HttpException_1.default(401, 'User recently changed password! Please log in again');
        }
        //  // 5- check if the user is active
        if (!user.active) {
            throw new HttpException_1.default(401, 'This user is no longer active');
        }
        let accessToken = (0, createToken_1.createAccessToken)(user._id);
        return { accessToken };
    }
    async forgotPassword(email) {
        // comments in details for the reset password route
        // 1- check if the user exists by email
        let user = await this.userDao.getUserByEmail(email);
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
        // 3- Send the reset code via email (the code will be expired after 10 minutes)
        const message = `Hi ${user.firstName}, \nwe received a request to reset the password on your Khidma Account.
        ${resetCode} \nEnter this code to complete the reset (the code will be expired after 10 minutes).\nThanks for helping us keep your account secure.`;
        try {
            await (0, nodemailer_1.sendMailer)(user.email, 'Reset Password', message);
        }
        catch (err) {
            user.passwordResetCode = undefined;
            user.passwordResetCodeExpiration = undefined;
            user.passwordResetVerified = false;
            await user.save();
            return new HttpException_1.default(500, 'There is an error in sending email');
        }
        // 6- return the reset code to the user
        return true;
        // TODO: log the user out from all devices (delete all the refresh tokens from the database for this user id and set the passwordChangedAt to now so all the refresh tokens will be invalid)
    }
    async verifyPassResetCode(resetCode) {
        // 1- check if the user exists
        let user = await this.userDao.getOne({ passwordResetCode: (0, hashing_1.hashCode)(resetCode), passwordResetCodeExpiration: { $gt: Date.now() } }, false);
        if (!user) {
            throw new HttpException_1.default(400, 'Invalid reset code or the code is expired');
        }
        // 3- set the passwordResetVerified to true
        user.passwordResetVerified = true;
        // 4- update the user document with the passwordResetVerified
        await user.save();
        return;
    }
    async resetPassword(email, newPassword) {
        // 1- check if the user exists by email
        let user = await this.userDao.getUserByEmail(email);
        if (!user) {
            throw new HttpException_1.default(404, 'User not found');
        }
        // 2- check if the reset code is verified
        if (!user.passwordResetVerified) {
            throw new HttpException_1.default(400, 'Please verify your reset code first');
        }
        // 3- hash the new password
        user.password = await bcrypt_1.default.hash(newPassword, validateEnv_1.default.SALT_ROUNDS);
        user.passwordResetVerified = false;
        user.passwordResetCode = undefined;
        user.passwordResetCodeExpiration = undefined;
        await user.save();
        // 4- generate a new token
        let accessToken = (0, createToken_1.createAccessToken)(user._id);
        let refreshToken = (0, createToken_1.createRefreshToken)(user._id);
        // 5- return the user and the token
        return { user, accessToken, refreshToken };
    }
    async changePassword(payload, user) {
        // 1- check if the password === user.password
        let isPasswordCorrect = await bcrypt_1.default.compare(payload.oldPassword, user.password);
        if (!isPasswordCorrect)
            throw new HttpException_1.default(401, 'Incorrect password');
        // 2- hash the new password
        let newPassword = await bcrypt_1.default.hash(payload.newPassword, validateEnv_1.default.SALT_ROUNDS);
        // 3- update the user with the new password and update the passwordChangedAt field
        let updatedUser = await this.userDao.updateOneById(user._id, { password: newPassword, passwordChangedAt: Date.now() });
        if (!updatedUser)
            throw new HttpException_1.default(500, 'Something went wrong');
        // 4- generate a new token
        let token = (0, createToken_1.createAccessToken)(user._id);
        return { token };
    }
};
exports.AuthServie = AuthServie = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [user_dao_1.default])
], AuthServie);
