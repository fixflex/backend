import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import fs from 'fs';

import User from '../DB/models/user/client.model';
import HttpException from '../exceptions/HttpException';
import { IUser } from '../interfaces/user.interface';
import { cloudinaryDeleteImage, cloudinaryUploadImage } from '../utils/cloudinary';

class UserController {
  public createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let { email, username, password } = req.body;

    let existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      if (existing.email === email) {
        return next(
          new HttpException(
            409,
            `E-Mail address ${email} is already exists, please pick a different one.`
          )
        );
      } else return next(new HttpException(409, 'Username already in use'));
    }

    password = await bcrypt.hash(password, 10);
    let user = await User.create(req.body);

    res.status(201).json({ user });
  });

  public getUsers = asyncHandler(async (_: Request, res: Response) => {
    let users = await User.find({}).select('-password -updatedAt -__v');
    res.status(200).json({ results: users.length, users });
  });

  public getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let user = await User.findById(req.params.id).lean();
    if (!user) return next(new HttpException(404, 'No user found'));
    res.status(200).json({ user });
  });

  public updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean<IUser>();
    if (!user) return next(new HttpException(404, 'No user found'));
    res.status(200).json({ user });
  });

  public updateProfileImage = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      //1- validate file
      if (!req.file) return next(new HttpException(400, 'Please upload a file'));
      //2- get the file path
      const filePath = `${req.file.path}`;
      //3- upload the file to cloudinary
      const result = await cloudinaryUploadImage(filePath);
      //4- update the user with the image url and public id
      const user = await User.findById(req.params.id);
      if (!user) return next(new HttpException(404, 'No user found'));
      //5- delete the old image from cloudinary if exists
      if (user.profilePicture.publicId) await cloudinaryDeleteImage(user.profilePicture.publicId);
      // 6. Change the profilePhoto field in the DB
      user.profilePicture = { url: result.secure_url, publicId: result.public_id };
      await user.save();
      //7- return the updated user
      res.status(200).json({ user });
      //8- remove the file from the server
      fs.unlinkSync(filePath);
    }
  );

  public deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new HttpException(404, 'No user found'));
    if (user.profilePicture.publicId) await cloudinaryDeleteImage(user.profilePicture.publicId);
    // TODO: delete all the posts and comments that belong to this user
    res.status(204).send();
  });
}

export default UserController;
