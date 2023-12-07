import bcrypt from 'bcrypt';
import { autoInjectable } from 'tsyringe';

import UserDao from '../DB/dao/user.dao';
import env from '../config/validateEnv';
import HttpException from '../exceptions/HttpException';
import { IUser } from '../interfaces/user.interface';
import { createToken } from '../utils/createToken';
import { hashCode } from '../utils/hashing';
import { sendMailer } from '../utils/nodemailer';

@autoInjectable()
export class AuthServie {
  constructor(private readonly userDao: UserDao) {}
  /**
   * Signup a new user
   * @param user - The user object to signup
   * @returns An object containing the newly created user and a token
   * @throws HttpException if the email or username already exists
   */
  async signup(user: IUser): Promise<{ user: IUser; token: string }> {
    // check if the user already exists
    let isEmailExists = await this.userDao.getUserByEmail(user.email);

    if (isEmailExists) {
      throw new HttpException(409, `E-Mail address ${user.email} is already exists, please pick a different one.`);
    }
    // hash the password
    user.password = await bcrypt.hash(user.password, env.SALT_ROUNDS);
    let newUser = await this.userDao.create(user);
    let token = createToken(newUser._id!);

    return { user: newUser, token };
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

  async forgotPassword(email: string) {
    // comments in details for the reset password route

    // 1- check if the user exists by email
    let user = await this.userDao.getUserByEmail(email, false);
    if (!user) {
      throw new HttpException(404, 'User not found');
    }
    // 2- generate a reset code
    const resetCode = Math.floor(100000 + Math.random() * 90000).toString();
    // 3- hash the reset code via crypto
    user.passwordResetCode = hashCode(resetCode);
    // 3- set the reset code expiration to 10 minutes
    user.passwordResetCodeExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes
    // 4- set the passwordResetVerified to false
    user.passwordResetVerified = false;
    // 5- update the user document with the hashed reset code and the reset code expiration the passwordResetVerified
    await user.save();
    // 5- send the reset code to the user email address using nodemailer
    // 3- Send the reset code via email
    const message = `Hi ${user.firstName}, \nwe received a request to reset the password on your Khidma Account.
        ${resetCode} \nEnter this code to complete the reset.\nThanks for helping us keep your account secure.`;
    try {
      await sendMailer(user.email, 'Reset Password', message);
    } catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetCodeExpiration = undefined;
      user.passwordResetVerified = undefined;

      await user.save();
      return new HttpException(500, 'There is an error in sending email');
    }

    // 6- return the reset code to the user
    return true;
    // TODO: log the user out from all devices (delete all the refresh tokens from the database for this user id and set the passwordChangedAt to now so all the refresh tokens will be invalid)
  }
}
