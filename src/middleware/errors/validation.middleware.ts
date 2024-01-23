import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const validatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // to use translate message you can use this code
    const errorsArray = errors.array();
    const errorsTranslate = errorsArray.map(error => {
      return { ...error, msg: req.t(error.msg) };
    });
    return res.status(400).json({ errors: errorsTranslate });
    // return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default validatorMiddleware;
