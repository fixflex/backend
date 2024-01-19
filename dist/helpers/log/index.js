"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devLogger_1 = require("./devLogger");
const prodLogger_1 = require("./prodLogger");
let logger;
if (process.env.NODE_ENV === 'development') {
    logger = devLogger_1.devLogger;
}
else {
    logger = prodLogger_1.prodLogger;
}
exports.default = logger;
