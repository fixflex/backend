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
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const tsyringe_1 = require("tsyringe");
const user_dao_1 = __importDefault(require("../../DB/dao/user.dao"));
const validateEnv_1 = __importDefault(require("../../config/validateEnv"));
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const cloudinary_1 = require("../../utils/cloudinary");
let UserService = class UserService {
    constructor(userDao) {
        this.userDao = userDao;
    }
    async getUsers(reqQuery) {
        let apiFeatures = new apiFeatures_1.default(reqQuery);
        let query = apiFeatures.filter();
        let paginate = apiFeatures.paginate();
        let sort = apiFeatures.sort();
        let fields = apiFeatures.selectFields();
        // search by keyword
        // if (reqQuery.keyword) {
        //   query = { ...query, bio: { $regex: reqQuery.keyword, $options: 'i' } };
        // }
        let users = await this.userDao.listUsers(query, paginate, sort, fields);
        if (users)
            paginate = apiFeatures.paginate(users.length); // update the pagination object with the total documents
        return { users, paginate };
    }
    async getUser(userId) {
        return await this.userDao.getOneById(userId);
    }
    async createUser(user) {
        // check if the user already exists
        let isEmailExists = await this.userDao.getUserByEmail(user.email);
        if (isEmailExists) {
            throw new HttpException_1.default(409, `E-Mail address ${user.email} is already exists, please pick a different one.`);
        }
        // hash the password
        user.password = await bcrypt_1.default.hash(user.password, validateEnv_1.default.SALT_ROUNDS);
        let newUser = await this.userDao.create(user);
        return newUser;
    }
    async updateUser(userId, user) {
        let isUserExists = await this.userDao.getOneById(userId);
        if (!isUserExists)
            throw new HttpException_1.default(404, 'No user found');
        return await this.userDao.updateOneById(userId, user);
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
        // 4- return the updated user
        return updatedUser;
    }
    async deleteUser(userId) {
        let isUserExists = await this.userDao.getOneById(userId);
        if (!isUserExists)
            throw new HttpException_1.default(404, 'No user found');
        // TODO: delete all the posts and comments that belong to this user
        return await this.userDao.deleteOneById(userId);
    }
    async updateProfileImage(userId, file) {
        const result = await (0, cloudinary_1.cloudinaryUploadImage)(file.buffer, 'user-profile-image');
        // updateOneById the user with the image url and public id
        let user = await this.userDao.getOneById(userId);
        if (!user)
            throw new HttpException_1.default(404, 'No user found');
        // delete the old image from cloudinary if exists
        if (user.profilePicture.publicId)
            await (0, cloudinary_1.cloudinaryDeleteImage)(user.profilePicture.publicId);
        // Change the profilePhoto field in the DB
        user = await this.userDao.updateOneById(userId, { profilePicture: { url: result.secure_url, publicId: result.public_id } });
        return user;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [user_dao_1.default])
], UserService);
