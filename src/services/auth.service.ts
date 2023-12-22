import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { autoInjectable } from 'tsyringe';

import UserDao from '../DB/dao/user.dao';
import env from '../config/validateEnv';
import HttpException from '../exceptions/HttpException';
import { IUser } from '../interfaces/user.interface';
import { createAccessToken } from '../utils/createToken';
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
  async signup(user: IUser) {
    // check if the user already exists
    let isEmailExists = await this.userDao.getUserByEmail(user.email);

    if (isEmailExists) {
      throw new HttpException(409, `E-Mail address ${user.email} is already exists, please pick a different one.`);
    }
    // hash the password
    user.password = await bcrypt.hash(user.password, env.SALT_ROUNDS);
    let newUser = await this.userDao.create(user);
    let accessToken = createAccessToken(newUser._id!);
    let refreshToken = createAccessToken(newUser._id!);

    return { user: newUser, accessToken, refreshToken };
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
    let accessToken = createAccessToken(user._id!);
    let refreshToken = createAccessToken(user._id!);
    return { user, accessToken, refreshToken };
  }

  async googleLogin(authorizationCode: string) {
    // 1. get the user data using jwt
    const decoded = jwt.decode(authorizationCode) as JwtPayload;
    // 2. check if the user exists
    let user = await this.userDao.getUserByEmail(decoded.email);
    // 3. if the user exists, return the user and the token (login)
    if (user) {
      let accessToken = createAccessToken(user._id!);
      let refreshToken = createAccessToken(user._id!);
      return { user, accessToken, refreshToken };
    }
    // 4. if the user does not exist, create a new user and return the user and the token (signup)
    let newUser = await this.userDao.create({
      email: decoded.email,
      emailVerified: decoded.email_verified,
      firstName: decoded.given_name,
      lastName: decoded.family_name,
      profilePicture: { url: decoded.picture, publicId: null },
    } as IUser);

    if (!newUser) {
      throw new HttpException(500, 'Something went wrong');
    }
    let accessToken = createAccessToken(newUser._id!);
    let refreshToken = createAccessToken(newUser._id!);

    return { user: newUser, accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const decoded = jwt.verify(refreshToken!, env.REFRESH_TOKEN_SECRET_KEY) as JwtPayload;

    // 3- check if the user still exists
    const user = await this.userDao.getOneById(decoded.userId);
    // 4- check if the user changed his password after the token was issued
    // TODO: make this check in the user model instead of here
    if (user!.passwordChangedAt && user!.passwordChangedAt.getTime() / 1000 > decoded.iat!) {
      throw new HttpException(401, 'User recently changed password! Please log in again');
    }
    //  // 5- check if the user is active
    if (!user!.active) {
      throw new HttpException(401, 'This user is no longer active');
    }

    let accessToken = createAccessToken(user!._id!);
    return { accessToken };
  }

  async forgotPassword(email: string) {
    // comments in details for the reset password route

    // 1- check if the user exists by email
    let user = await this.userDao.getUserByEmail(email);
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
    // 3- Send the reset code via email (the code will be expired after 10 minutes)

    const message = `Hi ${user.firstName}, \nwe received a request to reset the password on your Khidma Account.
        ${resetCode} \nEnter this code to complete the reset (the code will be expired after 10 minutes).\nThanks for helping us keep your account secure.`;
    try {
      await sendMailer(user.email, 'Reset Password', message);
    } catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetCodeExpiration = undefined;
      user.passwordResetVerified = false;

      await user.save();
      return new HttpException(500, 'There is an error in sending email');
    }

    // 6- return the reset code to the user
    return true;
    // TODO: log the user out from all devices (delete all the refresh tokens from the database for this user id and set the passwordChangedAt to now so all the refresh tokens will be invalid)
  }

  async verifyPassResetCode(resetCode: string) {
    // 1- check if the user exists
    let user: any = await this.userDao.getOne({ passwordResetCode: hashCode(resetCode), passwordResetCodeExpiration: { $gt: Date.now() } }, false);
    if (!user) {
      throw new HttpException(400, 'Invalid reset code or the code is expired');
    }
    // 3- set the passwordResetVerified to true
    user.passwordResetVerified = true;
    // 4- update the user document with the passwordResetVerified
    await user.save();
    return;
  }

  async resetPassword(email: string, newPassword: string) {
    // 1- check if the user exists by email
    let user: any = await this.userDao.getUserByEmail(email);
    if (!user) {
      throw new HttpException(404, 'User not found');
    }
    // 2- check if the reset code is verified
    if (!user.passwordResetVerified) {
      throw new HttpException(400, 'Please verify your reset code first');
    }
    // 3- hash the new password
    user.password = await bcrypt.hash(newPassword, env.SALT_ROUNDS);

    user.passwordResetVerified = false;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpiration = undefined;

    await user.save();
    // 4- generate a new token
    let accessToken = createAccessToken(user._id!);
    let refreshToken = createAccessToken(user._id!);
    // 5- return the user and the token
    return { user, accessToken, refreshToken };
  }
}
