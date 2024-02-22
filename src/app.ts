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
    this.app.use(cors({ origin: true, credentials: true, exposedHeaders: ['set-cookie'] }));
    this.app.use(express.json());
    this.app.use(cookieParser());
    if (this.env !== 'production') this.app.use(express.static(path.join(__dirname, '../public')));
    i18next
      .use(Backend)
      .use(i18nextMiddleware.LanguageDetector)
      .init({
        backend: {
          loadPath: path.join(__dirname, '../locales/{{lng}}/translation.json'),
          addPath: path.join(__dirname, '../locales/missing.json'),
        },
        fallbackLng: env.defaultLocale,
        saveMissing: true,
        detection: {
          // TODO: get the language from the user's browser
          order: ['header', 'cookie'],
          lookupHeader: 'accept-language',
          lookupCookie: 'accept-language',
          caches: ['cookie'], // cache the language in a cookie
        },
        // preload: ['en', 'ar'], // preload all languages
        // debug: env.NODE_ENV === 'development',
      });
    this.app.use(i18nextMiddleware.handle(i18next));
  }

  private initializeRoutes(routes: Routes[]) {
    // serve the static files (index.html)
    // if (this.env !== 'production') {
    //   this.app.use(express.static(path.join(__dirname, '../public')));
    // }
    //   🤬😡😡🤬 يحمااااار
    // this.app.use('/api/v1/callback', (req, res) => {
    //   // log the request body
    //   console.log(req.body);
    //   // return the response
    //   res.status(200).json({ message: 'callback received' });
    // });

    routes.forEach(route => {
      this.app.use('/api/v1', route.router);
    });
  }

  private initializeSwagger() {
    if (this.env !== 'production') {
      // this.app.use('/api-docs/saddamarbaa/', swaggerUi.serve, swaggerUi.setup(swaggerSaddamarbaa));
      this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }
  }

  private initializeErrorHandling() {
    this.app.use(notFound);
    this.app.use(errorMiddleware);
  }
}

export default App;
