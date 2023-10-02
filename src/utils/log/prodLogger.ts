import winston, { format } from 'winston';
import 'winston-mongodb';

import env from '../../config/validateEnv';

const logFormat = format.printf(info => {
  let message = `${info.timestamp} | ${info.level} | ${info.message}`;
  message = info.obj ? `${message} | data: ${JSON.stringify(info.obj)}` : message;
  return message;
});

const prodLogger = winston.createLogger({
  level: 'info',
  format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm' }), logFormat),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.MongoDB({
      level: 'info',
      db: env.DB_URI,
      capped: true,
      cappedSize: 10000000, // 10MB
      options: { useUnifiedTopology: true },
    }),
  ],
});

export { prodLogger };
