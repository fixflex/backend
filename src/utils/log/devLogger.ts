import winston, { format } from 'winston';
import 'winston-mongodb';

const logFormat = format.printf(info => {
  let message = `${info.timestamp} | ${info.level} | ${info.message}`;
  message = info.obj ? `${message} | data: ${JSON.stringify(info.obj)}` : message;

  return message;
});

const devLogger = winston.createLogger({
  level: 'info',
  format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm' }), logFormat),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error', maxsize: 1048576 }), // 1MB
    new winston.transports.File({ filename: 'combined.log', maxsize: 1048576, level: 'info' }), // 1MB
  ],
});

export { devLogger };
