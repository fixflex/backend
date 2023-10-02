import {   injectable } from 'tsyringe';
import UserDao from '../DB/dao/user.dao';
import bcrypt from 'bcrypt';
import { Document } from 'mongoose';

import HttpException from '../exceptions/HttpException';
import { IUser } from '../interfaces/User.interface';
import { createToken } from '../utils/createToken';

@injectable()
export class AuthServie {
  constructor(private readonly userDao: UserDao) {}
  
  async signup(user: IUser) {
    let newuser = await this.userDao.create(user);  
    return newuser;
  }

  async login(emailOrUsername: string, password: string) {

      // Check if the input is an email or a username
    const isEmail = /\S+@\S+\.\S+/.test(emailOrUsername);

    let user: (IUser & Document) | null;

    if (isEmail) {
      user = await this.userDao.getUserByEmail( emailOrUsername );
    } else {
      user = await this.userDao.getUserByUsername( emailOrUsername );
    }

    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new HttpException(401, 'Incorrect (email | username) or password`');

    let token = createToken(user._id);

    return { user, token };

  }
}
