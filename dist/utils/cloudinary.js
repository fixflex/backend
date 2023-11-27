"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryDeleteImage = exports.cloudinaryUploadImage = void 0;
const cloudinary_1 = require("cloudinary");
// import logger from '../log';
const validateEnv_1 = __importDefault(require("../config/validateEnv"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
cloudinary_1.v2.config({
    cloud_name: validateEnv_1.default.CLOUDINARY_CLOUD_NAME,
    api_key: validateEnv_1.default.CLOUDINARY_API_KEY,
    api_secret: validateEnv_1.default.CLOUDINARY_API_SECRET,
});
//   try {
//     const result = await cloudinary.uploader.upload(fileToUpload, {
//       resource_type: 'auto',
//       max_bytes: 1000000, // 1 MB
//     });
//     return result;
//   } catch (error) {
//     throw new HttpException(500, 'Something went wrong while uploading the image');
//   }
// };
const cloudinaryDeleteImage = async (publicId) => {
    try {
        const result = await cloudinary_1.v2.uploader.destroy(publicId);
        return result;
    }
    catch (error) {
        throw new HttpException_1.default(500, 'Something went wrong while deleting the image');
    }
};
exports.cloudinaryDeleteImage = cloudinaryDeleteImage;
const cloudinaryUploadImage = async (fileToUpload) => {
    try {
        const result = await cloudinary_1.v2.uploader.upload(fileToUpload, {
            quality: 80,
            resource_type: 'auto',
            transformation: [
                {
                    width: 500,
                    height: 500,
                    gravity: 'face',
                    crop: 'thumb',
                    radius: 'max', // rounded corners
                },
            ],
        });
        return result;
    }
    catch (error) {
        throw new HttpException_1.default(500, 'Something went wrong while uploading the image');
    }
};
exports.cloudinaryUploadImage = cloudinaryUploadImage;
