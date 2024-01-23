"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validatorMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
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
exports.default = validatorMiddleware;
