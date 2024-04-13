import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import { rateLimit } from 'express-rate-limit';
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
import { i18nMiddleware } from './middleware';
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

    if (env.NODE_ENV === 'production') {
      this.app.use(
        cors({
          origin: env.FRONTEND_URL,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
          credentials: true,
          exposedHeaders: ['set-cookie'],
        })
      );
    } else {
      // Allow all origins for development and staging environments
      this.app.use(cors({ origin: true, credentials: true, exposedHeaders: ['set-cookie'] }));
    }

    // Set security HTTP headers to prevent XSS attacks, clickjacking etc.
    this.app.use(helmet());

    // Compress response bodies for all requests
    this.app.use(
      compression({
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
      })
    );
    // Limit the body of the request to 50kb to prevent DOS attacks
    this.app.use(express.json({ limit: '50kb' }));

    // Data sanitization against NoSQL query injection
    this.app.use(mongoSanitize());

    // Data sanitization against XSS (Cross-Site Scripting) attacks
    this.app.use(xss());

    //  Rate limiter middleware to prevent brute force attacks on the login & reset password routes
    const limiter = rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 10, // limit each IP to 10 requests per windowMs
      message: 'Too many requests from this IP, please try again after 10 minutes',
    });
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
