import { IUser } from '../../interfaces/user.interface';
import UserModel from '../models/user/user.model';

class UserDao {
  async getUserByUsername(emailOrUsername: string): Promise<IUser | null> {
    return await UserModel.findOne({ username: emailOrUsername }).lean();
  }

  async getUserByEmail(emailOrUsername: string): Promise<IUser | null> {
    return await UserModel.findOne({ email: emailOrUsername }).lean();
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return await UserModel.findById(userId).lean();
  }

  async listUsers(query: any = {}, paginate: { skip: number; limit: number }, sort: any = {}, select: any = '-__v'): Promise<IUser[]> {
    // build the query
    let users = UserModel.find(query);
    if (paginate.skip) users = users.skip(paginate.skip);
    if (paginate.limit) users = users.limit(paginate.limit);
    users = users.sort(sort).select(select);
    // execute the query
    return await users.lean();
  }

  async create(user: IUser): Promise<IUser> {
    return await UserModel.create(user);
  }

  async update(userId: string, user: IUser): Promise<IUser | null> {
    console.log(user);
    return await UserModel.findByIdAndUpdate(userId, user, { new: true }).lean();
  }

  async delete(userId: string): Promise<IUser | null> {
    return await UserModel.findByIdAndDelete(userId).lean();
  }
}

export default UserDao;
