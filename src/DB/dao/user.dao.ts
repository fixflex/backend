import { IUser } from '../../interfaces';
import UserModel from '../models/user.model';
import CommonDAO from './base.dao';

class UserDao extends CommonDAO<IUser> {
  constructor() {
    super(UserModel);
  }

  async getUserByEmail(email: string) {
    return await UserModel.findOne({ email: email });
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
}

export default UserDao;
