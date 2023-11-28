//  unit test
import { cloudinaryDeleteImage, cloudinaryUploadImage } from '../../src/utils/cloudinary';
import { createToken } from '../../src/utils/createToken';

describe('utils', () => {
  describe('createToken', () => {
    it('should return a string', () => {
      expect(typeof createToken('123')).toBe('string');
    });
    it('should return a string with the correct format', () => {
      expect(createToken('123')).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/);
    });
  });

  describe('cloudinary', () => {
    let publicId: string;
    it('should return an object with image url', async () => {
      const result = await cloudinaryUploadImage('__test__/testFiles/testImage.jpg');
      publicId = result.public_id;
      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('public_id');
    });
    // cloudinary Delete Image
    it('should delete an image from cloudinary', async () => {
      const result = await cloudinaryDeleteImage(publicId);
      expect(result).toHaveProperty('result');
      expect(result.result).toBe('ok');
    });
  });
});
