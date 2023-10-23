import express from 'express';
import morgan from 'morgan';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import dbConnection from './DB';
import env from './config/validateEnv';
import swaggerDocument from './docs/swagger.json' assert { type: 'json' };
import { notFound } from './exceptions/notFound';
import './exceptions/shutdownHandler';
import { errorMiddleware } from './middleware/errors';
import logger from './utils/log';
class App {
    constructor(routes) {
        this.app = express();
        this.port = env.PORT || 8000;
        this.env = process.env.NODE_ENV || 'development';
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeSwagger();
        this.initializeErrorHandling();
    }
    getServer() {
        return this.app;
    }
    connectToDatabase() {
        dbConnection();
    }
    initializeMiddlewares() {
        if (this.env === 'development') {
            this.app.use(morgan('dev'));
        }
        this.app.use(express.json());
    }
    initializeRoutes(routes) {
        routes.forEach(route => {
            this.app.use('/api/v1', route.router);
        });
    }
    initializeSwagger() {
        if (this.env === 'development') {
            this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        }
    }
    initializeErrorHandling() {
        this.app.use(notFound);
        this.app.use(errorMiddleware);
    }
    listen() {
        return this.app.listen(this.port, () => {
            logger.info(`🚀 App listening in ${process.env.NODE_ENV} mode on the port ${this.port}`);
        });
    }
}
export default App;
