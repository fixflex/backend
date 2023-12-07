import { SentMessageInfo, Transporter, createTransport } from 'nodemailer';

import env from '../config/validateEnv';
import HttpException from '../exceptions/HttpException';

const sendMailer = async (to: string, subject: string, template: string): Promise<boolean> => {
  try {
    const mailer = createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT),
      auth: {
        user: env.SMTP_USERNAME,
        pass: env.SMTP_PASSWORD,
      },
    }) as Transporter<SentMessageInfo>;

    mailer.verify((err: any) => {
      if (err) {
        return Promise.reject(new HttpException(500, `Sending email error: ${err}`));
      }
    });

    mailer.on('error', err => {
      if (err) {
        return Promise.reject(new HttpException(500, `Sending email error: ${err}`));
      }
    });

    await mailer.sendMail({
      from: `${env.SMTP_NAME}<${env.SMTP_USERNAME}>`,
      to: to,
      subject: subject,
      // html: template,
      text: template,
      priority: 'high',
    });

    return true;
  } catch (e: any) {
    return Promise.reject(new HttpException(500, `Sending email error: ${e}`));
  }
};

export { sendMailer };
