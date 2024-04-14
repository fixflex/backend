import cookieParser from 'cookie-parser';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import path from 'path';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import xss from 'xss-clean';

import { dbConnection } from './DB';
import env from './config/validateEnv';
import swaggerDocument from './docs/swagger';
import { notFound } from './exceptions/notFoundException';
import './exceptions/shutdownHandler';
import { Routes } from './interfaces/routes.interface';
import { compression, cors, i18nMiddleware, limiter } from './middleware';
import { errorMiddleware } from './middleware/errors';
import { routes } from './routes/routes';
import { WhatsAppClient } from './services';

class App {
  public app: express.Application;
  public port: number | string;
  public env: string;
  private routes: Routes[];

  static instance: App | null = null;
  private constructor() {
    this.app = express();
    this.port = env.PORT || 8000;
    this.env = process.env.NODE_ENV || 'development';
    this.routes = routes;
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(this.routes);
    this.initializeWhatsAppWeb();
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  public getApp() {
    return this.app;
  }

  private connectToDatabase() {
    dbConnection();
  }

  private initializeMiddlewares() {
    if (this.env === 'development') {
      this.app.use(morgan('dev'));
    }
    this.app.use(cors);
    // Set security HTTP headers to prevent XSS attacks, clickjacking etc.
    this.app.use(helmet());
    // Compress response bodies for all requests
    this.app.use(compression);
    // Limit the body of the request to 50kb to prevent DOS attacks
    this.app.use(express.json({ limit: '50kb' }));
    // Data sanitization against NoSQL query injection
    this.app.use(mongoSanitize());
    // Data sanitization against XSS (Cross-Site Scripting) attacks
    this.app.use(xss());
    //  Rate limiter middleware to prevent brute force attacks on the login & reset password routes
    this.app.use('/api/v1/auth/login', limiter);
    this.app.use('/api/v1/auth/reset-password', limiter);
    // Prevent HTTP Parameter Pollution attacks
    this.app.use(hpp());
    this.app.use(cookieParser());
    if (this.env !== 'production') this.app.use(express.static(path.join(__dirname, '../public')));
    this.app.use(i18nMiddleware);
  }

  private initializeWhatsAppWeb() {
    if (process.env.NODE_ENV !== 'testing') WhatsAppClient.getInstance();
  }
  private initializeRoutes(routes: Routes[]) {
    // serve the static files (index.html)
    if (this.env !== 'production') {
      this.app.use(express.static(path.join(__dirname, '../public')));
    }
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

export { App };
