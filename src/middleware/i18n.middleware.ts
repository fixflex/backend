import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import path from 'path';

import env from '../config/validateEnv';

// Initialize i18n instance
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

// Export i18n middleware handle
export const i18nMiddleware = i18nextMiddleware.handle(i18next);
