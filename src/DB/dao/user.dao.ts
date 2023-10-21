import { IUser } from '../../interfaces/user.interface';
import UserModel from '../models/user/user.model';

class UserDao {
  static async getUserByUsername(emailOrUsername: string): Promise<IUser | null> {
    return await UserModel.findOne({ username: emailOrUsername }).lean();
  }

  static async getUserByEmail(emailOrUsername: string): Promise<IUser | null> {
    return await UserModel.findOne({ email: emailOrUsername }).lean();
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    return await UserModel.findById(userId).lean();
  }

  static async listUsers(query: any = {}, paginate: { skip: number; limit: number }, sort: any = {}, select: any = '-__v'): Promise<IUser[]> {
    // build the query
    let users = UserModel.find(query);
    if (paginate.skip) users = users.skip(paginate.skip);
    if (paginate.limit) users = users.limit(paginate.limit);
    users = users.sort(sort).select(select);
    // execute the query
    return await users.lean();
  }

  static async create(user: IUser): Promise<IUser> {
    return await UserModel.create(user);
  }

  static async update(userId: string, user: IUser): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(userId, user, { new: true }).lean();
  }

  static async delete(userId: string): Promise<IUser | null> {
    return await UserModel.findByIdAndDelete(userId).lean();
  }
}

export default UserDao;
