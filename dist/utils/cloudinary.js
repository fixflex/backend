var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v2 as cloudinary } from 'cloudinary';
import HttpException from '../exceptions/HttpException';
// import logger from '../log';
import env from '../config/validateEnv';
cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
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
const cloudinaryDeleteImage = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary.uploader.destroy(publicId);
        return result;
    }
    catch (error) {
        throw new HttpException(500, 'Something went wrong while deleting the image');
    }
});
const cloudinaryUploadImage = (fileToUpload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary.uploader.upload(fileToUpload, {
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
        throw new HttpException(500, 'Something went wrong while uploading the image');
    }
});
export { cloudinaryUploadImage, cloudinaryDeleteImage };
