import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
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
