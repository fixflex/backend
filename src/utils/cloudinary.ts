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

const cloudinaryDeleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    return result;
  } catch (error) {
    throw new HttpException(500, 'Something went wrong while deleting the image');
  }
};

const cloudinaryUploadImage = async (fileToUpload: string) => {
  try {
    const result = await cloudinary.uploader.upload(fileToUpload, {
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
    });

    return result;
  } catch (error) {
    throw new HttpException(500, 'Something went wrong while uploading the image');
  }
};

export { cloudinaryUploadImage, cloudinaryDeleteImage };
