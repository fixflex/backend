import HttpException from './HttpException';
export const notFound = (req, _res, next) => {
    next(new HttpException(404, `Not found - ${req.originalUrl}`));
};
