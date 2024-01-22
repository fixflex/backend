import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import morgan from 'morgan';
import path from 'path';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';

import dbConnection from './DB';
import env from './config/validateEnv';
// Documentation
import swaggerDocument from './docs/swagger';
import { notFound } from './exceptions/notFoundException';
import './exceptions/shutdownHandler';
import { Routes } from './interfaces/routes.interface';
import { errorMiddleware } from './middleware/errors';

class App {
  public app: express.Application;
  public port: number | string;
  public env: string;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = env.PORT || 8000;
    this.env = process.env.NODE_ENV || 'development';

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    dbConnection();
  }

  private initializeMiddlewares() {
    if (this.env === 'development') {
      this.app.use(morgan('dev'));
    }
    this.app.use(cors({ origin: true, credentials: true, exposedHeaders: ['set-cookie'] })); // for cross origin request (CORS) (for development) - allow all origins
    // this.app.use(cors({ origin: env.CLIENT_URL, credentials: true })); // for cross origin request (CORS) (for production) - allow specific origins
    // this.app.use(cors({ origin: env.CLIENT_URL, credentials: true, exposedHeaders: ['set-cookie'] })); // for cross origin request (CORS) (for production) - allow specific origins
    //  exposedHeaders: ['set-cookie']  means that the server can set the cookie in the response header and the client can read it from the response header
    this.app.use(express.json());
    // this.app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, '../public')));
    // i18next for internationalization (i18n)  (for multi language support)
    i18next
      .use(Backend)
      .use(i18nextMiddleware.LanguageDetector)
      .init({
        backend: {
          loadPath: path.join(__dirname, '../locales/{{lng}}/translation.json'), // this is where we load our translations from and we use {{lng}} and {{ns}} to load the correct language and namespace (for production)
          addPath: path.join(__dirname, '../locales/missing.json'), // this is where we save missing translations on-the-fly means when we use saveMissing: true it will save the missing keys in this file (for development)
        },
        fallbackLng: 'en', // fallback language is english.
        // preload: ['en', 'ar'], // preload all languages
        saveMissing: true, // send missing keys to endpoint specified in saveMissingTo (for development)
        // debug: env.NODE_ENV === 'development', // sset debug to true to view missing keys in the log file (for development)
        detection: {
          order: ['header', 'cookie'], // the order of prefered languages (for production)
          lookupHeader: 'accept-language', // the header name (for production)
          lookupCookie: 'accept-language', // the cookie name (for production)
          caches: ['cookie'], // cache the language in a cookie (for production)
        },
      });
    this.app.use(i18nextMiddleware.handle(i18next));
    // to access the translations file you can use req.t('key') or req.t('namespace:key') if you have namespaces in your translations file
    // the namespace is the file name without the extension for example if you have a file named translation.json the namespace is translation then you can use req.t('translation:key')
    // to be shure that you use the correct key you can use the i18next editor extension for vscode
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/api/v1', route.router);
    });
  }

  private initializeSwagger() {
    if (this.env !== 'production') {
      this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }
  }

  private initializeErrorHandling() {
    this.app.use(notFound);
    this.app.use(errorMiddleware);
  }
}

export default App;
