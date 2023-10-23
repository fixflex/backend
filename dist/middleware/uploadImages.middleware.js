import multer from 'multer';
import HttpException from '../exceptions/HttpException';
const multerStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, `${process.cwd()}/uploads`);
    },
    filename: (req, file, cb) => {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const ext = file.mimetype.split('/')[1];
        const imageFileName = `user-${userId}-${new Date().toISOString().replace(/:/g, '-')}.${ext}`;
        cb(null, imageFileName);
    },
});
const multerFilter = (_req, file, cd) => {
    if (file.mimetype.startsWith('image')) {
        cd(null, true);
    }
    else {
        cd(new HttpException(400, 'Not an image! Please upload only images'));
    }
};
// TODO: use memory storage instead of disk storage
export const imageUpload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
});
