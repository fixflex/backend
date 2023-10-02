import { Document } from 'mongoose';

import { IUser } from '../../interfaces/User.interface';
import UserModel from '../models/client.model';

class UserDao {
  async getUserByUsername(emailOrUsername: string): Promise<(IUser & Document) | null> {
    return await UserModel.findOne({ username: emailOrUsername });
  }

  async getUserByEmail(emailOrUsername: string): Promise<(IUser & Document) | null> {
    return await UserModel.findOne({ email: emailOrUsername });
  }

  async getUserById(userId: string) {
    return await UserModel.findById(userId);
  }

  async create(user: IUser): Promise<IUser> {
    return await UserModel.create(user);
  }
}

export default UserDao;
