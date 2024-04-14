import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import path from 'path';

import env from '../config/validateEnv';

/**
 * @description Middleware to handle internationalization and localization
 */
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, '../../locales/{{lng}}/translation.json'),
      addPath: path.join(__dirname, '../../locales/missing.json'),
    },
    fallbackLng: env.defaultLocale,
    saveMissing: true,
    detection: {
      order: ['header', 'cookie'],
      lookupHeader: 'accept-language',
      lookupCookie: 'accept-language',
      caches: ['cookie'],
    },
  });
const i18nMiddleware = i18nextMiddleware.handle(i18next);

/**
 *  @description Middleware to prevent brute force attacks on the login & reset password routes
 */
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again after 10 minutes',
});

/**
 * @description Middleware to handle compression of the response
 */
let compress = compression({
  level: 6, // set compression level from -1 to 9 (-1 default level, 0 no compression, 9 is the maximum compression level)
  threshold: 100 * 1024, // 100kb is the minimum size of the response before applying compression
  // filter function to determine if the response should be compressed
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false;
    }
    return compression.filter(req, res);
  },
});

/**
 * @description Middleware to handle CORS (Cross-Origin Resource Sharing)
 */
let cross: any;
if (env.NODE_ENV === 'production') {
  cross = cors({
    origin: env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });
} else {
  // Allow all origins for development and staging environments
  cross = cors({ origin: true, credentials: true, exposedHeaders: ['set-cookie'] });
}

export { i18nMiddleware, cross as cors, compress as compression, limiter };
