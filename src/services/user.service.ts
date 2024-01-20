import bcrypt from 'bcrypt';
import { autoInjectable } from 'tsyringe';

import UserDao from '../DB/dao/user.dao';
import env from '../config/validateEnv';
import HttpException from '../exceptions/HttpException';
import APIFeatures from '../helpers/apiFeatures';
import { cloudinaryDeleteImage, cloudinaryUploadImage } from '../helpers/cloudinary';
import { IPagination } from '../interfaces/pagination.interface';
import { IUser, IUserService } from '../interfaces/user.interface';

@autoInjectable()
class UserService implements IUserService {
  constructor(private readonly userDao: UserDao) {}

  async getUsers(reqQuery: any): Promise<{
    users: IUser[] | null;
    paginate: IPagination;
  }> {
    let apiFeatures = new APIFeatures(reqQuery);
    let query = apiFeatures.filter();
    let paginate = apiFeatures.paginate();
    let sort = apiFeatures.sort();
    let fields = apiFeatures.selectFields();
    // search by keyword
    // if (reqQuery.keyword) {
    //   query = { ...query, bio: { $regex: reqQuery.keyword, $options: 'i' } };
    // }

    let users = await this.userDao.listUsers(query, paginate, sort, fields);
    if (users) paginate = apiFeatures.paginate(users.length); // update the pagination object with the total documents

    return { users, paginate };
  }

  async getUser(userId: string) {
    return await this.userDao.getOneById(userId);
  }

  async createUser(user: IUser) {
    // check if the user already exists
    let isEmailExists = await this.userDao.getUserByEmail(user.email);
    if (isEmailExists) {
      throw new HttpException(409, `E-Mail address ${user.email} is already exists, please pick a different one.`);
    }
    // hash the password
    user.password = await bcrypt.hash(user.password, env.SALT_ROUNDS);
    let newUser = await this.userDao.create(user);
    return newUser;
  }

  async updateUser(userId: string, user: Partial<IUser>) {
    let isUserExists = await this.userDao.getOneById(userId);
    if (!isUserExists) throw new HttpException(404, 'No user found');
    if (user.email) {
      // check if the user already exists
      let isEmailExists = await this.userDao.getUserByEmail(user.email);
      if (isEmailExists) {
        throw new HttpException(409, `'This Email Is Already Taken: ${user.email}`);
      }
    }
    return await this.userDao.updateOneById(userId, user);
  }

  async deleteUser(userId: string) {
    let isUserExists = await this.userDao.getOneById(userId);
    if (!isUserExists) throw new HttpException(404, 'No user found');
    // TODO: delete all the posts and comments that belong to this user
    return await this.userDao.deleteOneById(userId);
  }

  async updateProfileImage(userId: string, file: Express.Multer.File) {
    const result = await cloudinaryUploadImage(file.buffer, 'user-profile-image');
    // updateOneById the user with the image url and public id
    let user = await this.userDao.getOneById(userId);
    if (!user) throw new HttpException(404, 'No user found');
    // delete the old image from cloudinary if exists
    if (user.profilePicture.publicId) await cloudinaryDeleteImage(user.profilePicture.publicId);
    // Change the profilePhoto field in the DB
    user = await this.userDao.updateOneById(userId, { profilePicture: { url: result.secure_url, publicId: result.public_id } } as IUser);

    return user;
  }
}

export { UserService };
