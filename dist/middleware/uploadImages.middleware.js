"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMixFiles = exports.uploadSingleFile = void 0;
const multer_1 = __importDefault(require("multer"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
// const multerStorage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, `${process.cwd()}/uploads`);
//   },
//   filename: (_req, file, cb) => {
//     let imageFileName: string;
//     const ext = file.mimetype.split('/')[1];
//     // it the file is imageCover then the name will contain cover
//     if (file.fieldname === 'imageCover') imageFileName = `cover-${new Date().toISOString().replace(/:/g, '-')}.${ext}`;
//     else imageFileName = `${new Date().toISOString().replace(/:/g, '-')}.${ext}`;
//     cb(null, imageFileName);
//   },
// });
const multerStorage = multer_1.default.memoryStorage();
const multerFilter = (_req, file, cd) => {
    if (file.mimetype.startsWith('image')) {
        cd(null, true);
    }
    else {
        cd(new HttpException_1.default(400, 'Not an image! Please upload only images'));
    }
};
const multerOptions = () => (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
});
const uploadSingleFile = (fileName) => multerOptions().single(fileName);
exports.uploadSingleFile = uploadSingleFile;
const uploadMixFiles = (arrayOfFields) => multerOptions().fields(arrayOfFields);
exports.uploadMixFiles = uploadMixFiles;
