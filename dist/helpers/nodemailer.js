"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailer = void 0;
const nodemailer_1 = require("nodemailer");
const validateEnv_1 = __importDefault(require("../config/validateEnv"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const sendMailer = async (to, subject, template) => {
    try {
        const mailer = (0, nodemailer_1.createTransport)({
            host: validateEnv_1.default.SMTP_HOST,
            port: parseInt(validateEnv_1.default.SMTP_PORT),
            auth: {
                user: validateEnv_1.default.SMTP_USERNAME,
                pass: validateEnv_1.default.SMTP_PASSWORD,
            },
        });
        mailer.verify((err) => {
            if (err) {
                return Promise.reject(new HttpException_1.default(500, `Sending email error: ${err}`));
            }
        });
        mailer.on('error', err => {
            if (err) {
                return Promise.reject(new HttpException_1.default(500, `Sending email error: ${err}`));
            }
        });
        await mailer.sendMail({
            from: `${validateEnv_1.default.SMTP_NAME}<${validateEnv_1.default.SMTP_USERNAME}>`,
            to: to,
            subject: subject,
            // html: template,
            text: template,
            priority: 'high',
        });
        return true;
    }
    catch (e) {
        return Promise.reject(new HttpException_1.default(500, `Sending email error: ${e}`));
    }
};
exports.sendMailer = sendMailer;
