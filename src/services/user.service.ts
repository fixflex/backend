import bcrypt from 'bcrypt';
import { autoInjectable } from 'tsyringe';

// import { app } from '../';
import UserDao from '../DB/dao/user.dao';
import env from '../config/validateEnv';
import HttpException from '../exceptions/HttpException';
import { hashCode, randomNum } from '../helpers';
import { cloudinaryDeleteImage, cloudinaryUploadImage } from '../helpers/cloudinary';
import { IUser, IUserService } from '../interfaces';
import { WhatsAppClient } from './whatsappClient.service';

@autoInjectable()
class UserService implements IUserService {
  constructor(private readonly userDao: UserDao) {}

  // async getUsers(reqQuery: any): Promise<{
  //   users: IUser[] | null;
  //   paginate: IPagination;
  // }> {
  //   let apiFeatures = new APIFeatures(reqQuery);
  //   let query = apiFeatures.filter();
  //   let paginate = apiFeatures.paginate();
  //   let sort = apiFeatures.sort();
  //   let fields = apiFeatures.selectFields();
  //   // search by keyword
  //   // if (reqQuery.keyword) {
  //   //   query = { ...query, bio: { $regex: reqQuery.keyword, $options: 'i' } };
  //   // }

  //   let users = await this.userDao.listUsers(query, paginate, sort, fields);
  //   if (users) paginate = apiFeatures.paginate(users.length); // update the pagination object with the total documents

  //   return { users, paginate };
  // }

  async getUser(userId: string) {
    return await this.userDao.getOneById(userId);
  }

  async createUser(user: IUser) {
    // check if the user already exists
    let isEmailExists = await this.userDao.getUserByEmail(user.email);
    if (isEmailExists) {
      throw new HttpException(409, 'email_already_exist');
    }
    // hash the password
    user.password = await bcrypt.hash(user.password, env.SALT_ROUNDS);
    let newUser = await this.userDao.create(user);
    return newUser;
  }

  async updateUser(userId: string, user: Partial<IUser>) {
    let isUserExists = await this.userDao.getOneById(userId);
    if (!isUserExists) throw new HttpException(404, 'user_not_found');
    if (user.email) {
      // check if the user already exists
      let isEmailExists = await this.userDao.getUserByEmail(user.email);
      if (isEmailExists) {
        throw new HttpException(409, 'email_already_exist');
      }
    }
    return await this.userDao.updateOneById(userId, user);
  }

  async deleteUser(userId: string) {
    let isUserExists = await this.userDao.getOneById(userId);
    if (!isUserExists) throw new HttpException(404, 'user_not_found');
    // TODO: delete all the posts and comments that belong to this user
    return await this.userDao.deleteOneById(userId);
  }

  async updateProfileImage(userId: string, file: Express.Multer.File) {
    const result = await cloudinaryUploadImage(file.buffer, 'user-profile-image');
    // updateOneById the user with the image url and public id
    let user = await this.userDao.getOneById(userId);
    if (!user) throw new HttpException(404, 'user_not_found');
    // delete the old image from cloudinary if exists
    if (user.profilePicture.publicId) await cloudinaryDeleteImage(user.profilePicture.publicId);
    // Change the profilePhoto field in the DB
    user = await this.userDao.updateOneById(userId, { profilePicture: { url: result.secure_url, publicId: result.public_id } } as IUser);

    return user;
  }

  async sendVerificationCode(user: IUser) {
    // Step 1: Check if the user has a phone number
    if (!user.phoneNumber) throw new HttpException(400, 'You must have a phone number to verify');
    // Step 2: Generate a random 6 digits code (Verification code)
    let verificationCode = randomNum(6);
    // Step 3: Send the verification code to the user phone number
    await WhatsAppClient.sendMessage(user.phoneNumber, `Verification code is: ${verificationCode}`);
    // Step 4: Hash the verification code
    let hashedVerificationCode = hashCode(verificationCode);
    // step 5: Set the expiration time for the verification code to 10 minutes and save it in the database
    let expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    let updatedUser = await this.userDao.updateOneById(user._id, {
      phoneNumVerificationCode: hashedVerificationCode,
      phoneNumVerificationCodeExpiration: expirationTime,
    });

    if (!updatedUser) throw new HttpException(500, 'something_went_wrong');

    return true;
  }

  async verifyCode(user: IUser, verificationCode: string) {
    if (!verificationCode) throw new HttpException(400, 'verification_code_required');
    // Step 1: Check if the user has a phone number
    if (!user.phoneNumber) throw new HttpException(400, 'You must have a phone number to verify');
    // Step 2: Check if the verification code is expired
    // if (user.phoneNumVerificationCodeExpiration < Date.now()) throw new HttpException(400, 'verification_code_expired');
    // Step 3: Check if the verification code is correct
    if (hashCode(verificationCode) !== user.phoneNumVerificationCode) throw new HttpException(400, 'invalid_verification_code');
    // Step 4: Update the user phoneNumVerified to true
    let updatedUser = await this.userDao.updateOneById(user._id, { phoneNumVerified: true });
    if (!updatedUser) throw new HttpException(500, 'something_went_wrong');
    return true;
  }
}

export { UserService };
