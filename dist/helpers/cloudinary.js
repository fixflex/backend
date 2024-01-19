"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryDeleteImage = exports.cloudinaryUploadImage = void 0;
const cloudinary_1 = require("cloudinary");
// import { Stream } from 'stream';
const streamifier_1 = __importDefault(require("streamifier"));
// import logger from '../log';
const validateEnv_1 = __importDefault(require("../config/validateEnv"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
cloudinary_1.v2.config({
    cloud_name: validateEnv_1.default.CLOUDINARY_CLOUD_NAME,
    api_key: validateEnv_1.default.CLOUDINARY_API_KEY,
    api_secret: validateEnv_1.default.CLOUDINARY_API_SECRET,
});
const optionsForUserProfileImage = {
    folder: 'user-profile-images',
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
};
const optionsForServiceImage = {
    folder: 'services-images',
    resource_type: 'auto',
};
const optionsForTaskImage = {
    folder: 'task-images',
    resource_type: 'auto',
};
const cloudinaryUploadImage = async (buffer, imageType) => {
    try {
        if (buffer) {
            return new Promise((resolve, reject) => {
                let uploadOptions = {};
                if (imageType === 'user-profile-image')
                    uploadOptions = optionsForUserProfileImage;
                else if (imageType === 'service-image')
                    uploadOptions = optionsForServiceImage;
                else if (imageType === 'task-image')
                    uploadOptions = optionsForTaskImage;
                else
                    throw new HttpException_1.default(400, 'Invalid image type');
                let cld_upload_stream = cloudinary_1.v2.uploader.upload_stream(uploadOptions, function (error, result) {
                    if (result) {
                        resolve(result);
                    }
                    else {
                        reject(error);
                    }
                });
                streamifier_1.default.createReadStream(buffer).pipe(cld_upload_stream);
            });
        }
        else {
            throw new HttpException_1.default(400, 'Invalid file provided');
        }
    }
    catch (err) {
        throw new HttpException_1.default(500, 'Something went wrong while uploading the image');
    }
};
exports.cloudinaryUploadImage = cloudinaryUploadImage;
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
