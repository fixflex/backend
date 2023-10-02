import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

import HttpException from '../exceptions/HttpException';
import { AuthRequest } from '../interfaces/auth.interface';

const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, `${process.cwd()}/uploads`);
  },
  filename: (req: AuthRequest, file, cb) => {
    const userId = req.user?._id;
    const ext = file.mimetype.split('/')[1];
    const imageFileName = `user-${userId}-${new Date().toISOString().replace(/:/g, '-')}.${ext}`;
    cb(null, imageFileName);
  },
});

const multerFilter = (_req: Request, file: Express.Multer.File, cd: FileFilterCallback) => {
  if (file.mimetype.startsWith('image')) {
    cd(null, true);
  } else {
    cd(new HttpException(400, 'Not an image! Please upload only images'));
  }
};

// TODO: use memory storage instead of disk storage
export const imageUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
});
