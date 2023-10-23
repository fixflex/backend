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
import UserDao from '../DB/dao/user.dao';
import HttpException from '../exceptions/HttpException';
import { createToken } from '../utils/createToken';
export class AuthServie {
    /**
     * Signup a new user
     * @param user - The user object to signup
     * @returns An object containing the newly created user and a token
     * @throws HttpException if the email or username already exists
     */
    signup(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if the user already exists
            let isEmailExists = yield UserDao.getUserByEmail(user.email);
            if (isEmailExists) {
                throw new HttpException(409, `E-Mail address ${user.email} is already exists, please pick a different one.`);
            }
            // hash the password
            user.password = yield bcrypt.hash(user.password, 10);
            let newUser = yield UserDao.create(user);
            let token = createToken(newUser._id);
            return { user: newUser, token };
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            if (!email || !password) {
                throw new HttpException(400, 'Email and password are required');
            }
            user = yield UserDao.getUserByEmail(email);
            if (!user || !(yield bcrypt.compare(password, user.password))) {
                throw new HttpException(401, 'Incorrect email or password');
            }
            let token = createToken(user._id);
            return { user, token };
        });
    }
}
