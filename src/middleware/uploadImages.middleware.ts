import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

import HttpException from '../exceptions/HttpException';

const multerOptions = () =>
  multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
  });

// TODO: use memory storage instead of disk storage
const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, `${process.cwd()}/uploads`);
  },
  filename: (_req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    // it the file is imageCover then the name will contain cover
    // if (file.fieldname === 'profilePicture') return cb(null, `profilePicture-${new Date().toISOString().replace(/:/g, '-')}.${ext}`);
    const imageFileName = `${new Date().toISOString().replace(/:/g, '-')}.${ext}`;
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

export const uploadSingleFile = (fileName: string) => multerOptions().single(fileName);
export const uploadMixFiles = (arrayOfFields: { name: string; maxCount?: number }[]) => multerOptions().fields(arrayOfFields);
