import bcrypt from 'bcrypt';

import UserDao from '../DB/dao/user.dao';
import HttpException from '../exceptions/HttpException';
import { IUser } from '../interfaces/user.interface';
import { createToken } from '../utils/createToken';

export class AuthServie {
  /**
   * Signup a new user
   * @param user - The user object to signup
   * @returns An object containing the newly created user and a token
   * @throws HttpException if the email or username already exists
   */
  async signup(user: IUser): Promise<{ user: IUser; token: string }> {
    // check if the user already exists
    let isEmailExists = await UserDao.getUserByEmail(user.email);

    if (isEmailExists) {
      throw new HttpException(409, `E-Mail address ${user.email} is already exists, please pick a different one.`);
    }
    // hash the password
    user.password = await bcrypt.hash(user.password, 10);
    let newUser = await UserDao.create(user);
    let token = createToken(newUser._id!);

    return { user: newUser, token };
  }

  async login(email: string, password: string) {
    let user: IUser | null;

    if (!email || !password) {
      throw new HttpException(400, 'Email and password are required');
    }

    user = await UserDao.getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException(401, 'Incorrect email or password');
    }

    let token = createToken(user._id!);
    return { user, token };
  }
}
