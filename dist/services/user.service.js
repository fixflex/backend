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
const __1 = require("..");
const user_dao_1 = __importDefault(require("../DB/dao/user.dao"));
const validateEnv_1 = __importDefault(require("../config/validateEnv"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const helpers_1 = require("../helpers");
const cloudinary_1 = require("../helpers/cloudinary");
let UserService = class UserService {
    constructor(userDao) {
        this.userDao = userDao;
    }
    // async getUsers(reqQuery: any): Promise<{
    //   users: IUser[] | null;
    //   paginate: IPagination;
    // }> {
    //   let apiFeatures = new APIFeatures(reqQuery);
    //   let query = apiFeatures.filter();
    //   let paginate = apiFeatures.paginate();
    //   let sort = apiFeatures.sort();
    //   let fields = apiFeatures.selectFields();
    //   // search by keyword
    //   // if (reqQuery.keyword) {
    //   //   query = { ...query, bio: { $regex: reqQuery.keyword, $options: 'i' } };
    //   // }
    //   let users = await this.userDao.listUsers(query, paginate, sort, fields);
    //   if (users) paginate = apiFeatures.paginate(users.length); // update the pagination object with the total documents
    //   return { users, paginate };
    // }
    async getUser(userId) {
        return await this.userDao.getOneById(userId);
    }
    async createUser(user) {
        // check if the user already exists
        let isEmailExists = await this.userDao.getUserByEmail(user.email);
        if (isEmailExists) {
            throw new HttpException_1.default(409, 'email_already_exist');
        }
        // hash the password
        user.password = await bcrypt_1.default.hash(user.password, validateEnv_1.default.SALT_ROUNDS);
        let newUser = await this.userDao.create(user);
        return newUser;
    }
    async updateUser(userId, user) {
        let isUserExists = await this.userDao.getOneById(userId);
        if (!isUserExists)
            throw new HttpException_1.default(404, 'user_not_found');
        if (user.email) {
            // check if the user already exists
            let isEmailExists = await this.userDao.getUserByEmail(user.email);
            if (isEmailExists) {
                throw new HttpException_1.default(409, 'email_already_exist');
            }
        }
        return await this.userDao.updateOneById(userId, user);
    }
    async deleteUser(userId) {
        let isUserExists = await this.userDao.getOneById(userId);
        if (!isUserExists)
            throw new HttpException_1.default(404, 'user_not_found');
        // TODO: delete all the posts and comments that belong to this user
        return await this.userDao.deleteOneById(userId);
    }
    async updateProfileImage(userId, file) {
        const result = await (0, cloudinary_1.cloudinaryUploadImage)(file.buffer, 'user-profile-image');
        // updateOneById the user with the image url and public id
        let user = await this.userDao.getOneById(userId);
        if (!user)
            throw new HttpException_1.default(404, 'user_not_found');
        // delete the old image from cloudinary if exists
        if (user.profilePicture.publicId)
            await (0, cloudinary_1.cloudinaryDeleteImage)(user.profilePicture.publicId);
        // Change the profilePhoto field in the DB
        user = await this.userDao.updateOneById(userId, { profilePicture: { url: result.secure_url, publicId: result.public_id } });
        return user;
    }
    async sendVerificationCode(user) {
        // Step 1: Check if the user has a phone number
        if (!user.phoneNumber)
            throw new HttpException_1.default(400, 'You must have a phone number to verify');
        // Step 2: Check if the Client is ready (whatsappclient)
        if (!global['myGlobalVar'])
            throw new HttpException_1.default(500, 'Something went wrong, please try again later');
        // Step 3: Generate a random 6 digits code (Verification code)
        let verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits random code
        // Step 4: Hash the verification code
        let hashedVerificationCode = (0, helpers_1.hashCode)(verificationCode);
        // step 5: Set the expiration time for the verification code to 10 minutes and save it in the database
        let expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes
        let updatedUser = await this.userDao.updateOneById(user._id, {
            phoneNumVerificationCode: hashedVerificationCode,
            phoneNumVerificationCodeExpiration: expirationTime,
        });
        if (!updatedUser)
            throw new HttpException_1.default(500, 'something_went_wrong');
        // Step 6: Send the verification code to the user phone number using the whatsappclient
        let phoneNumber = user.phoneNumber.replace(/^0/, '20') + '@c.us';
        let mes = await __1.whatsappclient.sendMessage(phoneNumber, `Verification code is: ${verificationCode}`);
        console.log('mes.body', mes._data.body);
        console.log('TO =>', mes._data.to);
        return true;
    }
    async verifyCode(user, verificationCode) {
        if (!verificationCode)
            throw new HttpException_1.default(400, 'verification_code_required');
        // Step 1: Check if the user has a phone number
        if (!user.phoneNumber)
            throw new HttpException_1.default(400, 'You must have a phone number to verify');
        // Step 2: Check if the verification code is expired
        // if (user.phoneNumVerificationCodeExpiration < Date.now()) throw new HttpException(400, 'verification_code_expired');
        // Step 3: Check if the verification code is correct
        if ((0, helpers_1.hashCode)(verificationCode) !== user.phoneNumVerificationCode)
            throw new HttpException_1.default(400, 'invalid_verification_code');
        // Step 4: Update the user phoneNumVerified to true
        let updatedUser = await this.userDao.updateOneById(user._id, { phoneNumVerified: true });
        if (!updatedUser)
            throw new HttpException_1.default(500, 'something_went_wrong');
        return true;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [user_dao_1.default])
], UserService);
