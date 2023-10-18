import {   injectable } from 'tsyringe';
import UserDao from '../DB/dao/user.dao';
import bcrypt from 'bcrypt';

import HttpException from '../exceptions/HttpException';
import { createToken } from '../utils/createToken';
import { IUser } from '../interfaces/user.interface';

@injectable()
export class AuthServie {
  constructor(private readonly userDao: UserDao) {}
  
  async signup(user: IUser) {
    let newuser = await this.userDao.create(user);  
    return newuser;
  }

  async login(email: string, password: string) {

    let user: IUser | null;

    if (!email || !password) {
      throw new HttpException(400, 'Email and password are required');
    }

    user = await this.userDao.getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException(401, 'Incorrect email or password');
    }

    let token = createToken(user._id!);
    return { user, token };
  }
}
