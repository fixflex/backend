var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
import fs from 'fs';
import UserDao from '../../DB/dao/user.dao';
import HttpException from '../../exceptions/HttpException';
import APIFeatures from '../../utils/apiFeatures';
import { cloudinaryDeleteImage, cloudinaryUploadImage } from '../../utils/cloudinary';
class UserService {
    getUsers(reqQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            let apiFeatures = new APIFeatures(reqQuery);
            let query = apiFeatures.filter();
            let paginate = apiFeatures.paginate();
            let sort = apiFeatures.sort();
            let fields = apiFeatures.selectFields();
            // search by keyword
            // if (reqQuery.keyword) {
            //   query = { ...query, bio: { $regex: reqQuery.keyword, $options: 'i' } };
            // }
            let users = yield UserDao.listUsers(query, paginate, sort, fields);
            if (users)
                paginate = apiFeatures.paginate(users.length); // update the pagination object with the total documents
            return { users, paginate };
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserDao.getUserById(userId);
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if the user already exists
            let isEmailExists = yield UserDao.getUserByEmail(user.email);
            if (isEmailExists) {
                throw new HttpException(409, `E-Mail address ${user.email} is already exists, please pick a different one.`);
            }
            // hash the password
            user.password = yield bcrypt.hash(user.password, 10);
            let newUser = yield UserDao.create(user);
            return newUser;
        });
    }
    updateUser(userId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let isUserExists = yield UserDao.getUserById(userId);
            if (!isUserExists)
                throw new HttpException(404, 'No user found');
            return yield UserDao.update(userId, user);
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let isUserExists = yield UserDao.getUserById(userId);
            if (!isUserExists)
                throw new HttpException(404, 'No user found');
            // TODO: delete all the posts and comments that belong to this user
            return yield UserDao.delete(userId);
        });
    }
    updateProfileImage(userId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = `${file.path}`;
            const result = yield cloudinaryUploadImage(filePath);
            // update the user with the image url and public id
            let user = yield UserDao.getUserById(userId);
            if (!user)
                throw new HttpException(404, 'No user found');
            // delete the old image from cloudinary if exists
            if (user.profilePicture.publicId)
                yield cloudinaryDeleteImage(user.profilePicture.publicId);
            // Change the profilePhoto field in the DB
            user = yield UserDao.update(userId, { profilePicture: { url: result.secure_url, publicId: result.public_id } });
            // remove the file from the server
            fs.unlinkSync(filePath);
            return user;
        });
    }
}
export { UserService };
