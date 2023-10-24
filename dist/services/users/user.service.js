"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const user_dao_1 = __importDefault(require("../../DB/dao/user.dao"));
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const cloudinary_1 = require("../../utils/cloudinary");
class UserService {
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
        let users = await user_dao_1.default.listUsers(query, paginate, sort, fields);
        if (users)
            paginate = apiFeatures.paginate(users.length); // update the pagination object with the total documents
        return { users, paginate };
    }
    async getUser(userId) {
        return await user_dao_1.default.getUserById(userId);
    }
    async createUser(user) {
        // check if the user already exists
        let isEmailExists = await user_dao_1.default.getUserByEmail(user.email);
        if (isEmailExists) {
            throw new HttpException_1.default(409, `E-Mail address ${user.email} is already exists, please pick a different one.`);
        }
        // hash the password
        user.password = await bcrypt_1.default.hash(user.password, 10);
        let newUser = await user_dao_1.default.create(user);
        return newUser;
    }
    async updateUser(userId, user) {
        let isUserExists = await user_dao_1.default.getUserById(userId);
        if (!isUserExists)
            throw new HttpException_1.default(404, 'No user found');
        return await user_dao_1.default.update(userId, user);
    }
    async deleteUser(userId) {
        let isUserExists = await user_dao_1.default.getUserById(userId);
        if (!isUserExists)
            throw new HttpException_1.default(404, 'No user found');
        // TODO: delete all the posts and comments that belong to this user
        return await user_dao_1.default.delete(userId);
    }
    async updateProfileImage(userId, file) {
        const filePath = `${file.path}`;
        const result = await (0, cloudinary_1.cloudinaryUploadImage)(filePath);
        // update the user with the image url and public id
        let user = await user_dao_1.default.getUserById(userId);
        if (!user)
            throw new HttpException_1.default(404, 'No user found');
        // delete the old image from cloudinary if exists
        if (user.profilePicture.publicId)
            await (0, cloudinary_1.cloudinaryDeleteImage)(user.profilePicture.publicId);
        // Change the profilePhoto field in the DB
        user = await user_dao_1.default.update(userId, { profilePicture: { url: result.secure_url, publicId: result.public_id } });
        // remove the file from the server
        fs_1.default.unlinkSync(filePath);
        return user;
    }
}
exports.UserService = UserService;
