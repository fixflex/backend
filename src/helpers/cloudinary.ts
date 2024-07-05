import { UploadApiOptions, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
// import { Stream } from 'stream';
import streamifier from 'streamifier';

// import logger from '../log';
import env from '../config/validateEnv';
import HttpException from '../exceptions/HttpException';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const optionsForUserProfileImage: UploadApiOptions = {
  folder: 'user-profile-images',
  quality: 80,
  resource_type: 'auto',
  transformation: [
    {
      width: 500,
      height: 500,
      gravity: 'face',
      crop: 'thumb', // thumb preserving its aspect ratio
      radius: 'max', // rounded corners
    },
  ],
};

const optionsForServiceImage: UploadApiOptions = {
  folder: 'services-images',
  resource_type: 'auto',
};

const optionsForTaskImage: UploadApiOptions = {
  folder: 'task-images',
  resource_type: 'auto',
};

const optionsForTaskerPortfolio: UploadApiOptions = {
  folder: 'tasker-portfolio',
  resource_type: 'auto',
};

const cloudinaryUploadImage = async (buffer: Buffer, imageType: any): Promise<UploadApiResponse> => {
  try {
    if (buffer) {
      return new Promise((resolve, reject) => {
        let uploadOptions: UploadApiOptions = {};
        if (imageType === 'user-profile-image') uploadOptions = optionsForUserProfileImage;
        else if (imageType === 'service-image') uploadOptions = optionsForServiceImage;
        else if (imageType === 'task-image') uploadOptions = optionsForTaskImage;
        else if (imageType === 'tasker-portfolio') uploadOptions = optionsForTaskerPortfolio;
        else throw new HttpException(400, 'Invalid image type');
        let cld_upload_stream = cloudinary.uploader.upload_stream(uploadOptions, function (error, result) {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(buffer).pipe(cld_upload_stream);
      });
    } else {
      throw new HttpException(400, 'Invalid file provided');
    }
  } catch (err) {
    throw new HttpException(500, 'Something went wrong while uploading the image');
  }
};

const cloudinaryDeleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    return result;
  } catch (error) {
    throw new HttpException(500, 'Something went wrong while deleting the image');
  }
};

// const cloudinaryUploadImage = async (fileToUpload: string) => {
//   try {
//     const result = await cloudinary.uploader.upload(fileToUpload, {
//       quality: 80,
//       resource_type: 'auto',
//       transformation: [
//         {
//           width: 500,
//           height: 500,
//           gravity: 'face',
//           crop: 'thumb', // thumb preserving its aspect ratio
//           radius: 'max', // rounded corners
//         },
//       ],
//     });

//     return result;
//   } catch (error) {
//     throw new HttpException(500, 'Something went wrong while uploading the image');
//   }
// };

export { cloudinaryUploadImage, cloudinaryDeleteImage };
