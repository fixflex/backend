var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UserModel from '../models/user/user.model';
class UserDao {
    static getUserByUsername(emailOrUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserModel.findOne({ username: emailOrUsername }).lean();
        });
    }
    static getUserByEmail(emailOrUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserModel.findOne({ email: emailOrUsername }).lean();
        });
    }
    static getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserModel.findById(userId).lean();
        });
    }
    static listUsers(query = {}, paginate, sort = {}, select = '-__v') {
        return __awaiter(this, void 0, void 0, function* () {
            // build the query
            let users = UserModel.find(query);
            if (paginate.skip)
                users = users.skip(paginate.skip);
            if (paginate.limit)
                users = users.limit(paginate.limit);
            users = users.sort(sort).select(select);
            // execute the query
            return yield users.lean();
        });
    }
    static create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserModel.create(user);
        });
    }
    static update(userId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserModel.findByIdAndUpdate(userId, user, { new: true }).lean();
        });
    }
    static delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserModel.findByIdAndDelete(userId).lean();
        });
    }
}
export default UserDao;
