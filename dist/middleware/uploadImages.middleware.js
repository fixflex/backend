"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
// TODO: use memory storage instead of disk storage
const multerStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, `${process.cwd()}/uploads`);
    },
    filename: (_req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const imageFileName = `${new Date().toISOString().replace(/:/g, '-')}.${ext}`;
        cb(null, imageFileName);
    },
});
const multerFilter = (_req, file, cd) => {
    if (file.mimetype.startsWith('image')) {
        cd(null, true);
    }
    else {
        cd(new HttpException_1.default(400, 'Not an image! Please upload only images'));
    }
};
// TODO: use memory storage instead of disk storage
exports.imageUpload = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
});
