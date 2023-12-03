import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

import HttpException from '../exceptions/HttpException';

// TODO: use memory storage instead of disk storage
const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, `${process.cwd()}/uploads`);
  },
  filename: (_req, file, cb) => {
    let imageFileName: string;
    const ext = file.mimetype.split('/')[1];
    // it the file is imageCover then the name will contain cover
    if (file.fieldname === 'imageCover') imageFileName = `cover-${new Date().toISOString().replace(/:/g, '-')}.${ext}`;
    else imageFileName = `${new Date().toISOString().replace(/:/g, '-')}.${ext}`;
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
const multerOptions = () =>
  multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
  });

export const uploadSingleFile = (fileName: string) => multerOptions().single(fileName);
export const uploadMixFiles = (arrayOfFields: { name: string; maxCount?: number }[]) => multerOptions().fields(arrayOfFields);
