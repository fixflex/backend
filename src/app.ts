import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import morgan from 'morgan';
import path from 'path';
import qrcode from 'qrcode-terminal';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import { Client, LocalAuth } from 'whatsapp-web.js';

import { dbConnection } from './DB';
import env from './config/validateEnv';
// Documentation
import swaggerDocument from './docs/swagger';
import { notFound } from './exceptions/notFoundException';
import './exceptions/shutdownHandler';
import { sendMailer } from './helpers';
import { Routes } from './interfaces/routes.interface';
import { errorMiddleware } from './middleware/errors';
import { routes } from './routes/routes';

class App {
  public app: express.Application;
  public port: number | string;
  public env: string;
  public whatsappclient: any;
  private routes: Routes[];
  constructor() {
    this.app = express();
    this.port = env.PORT || 8000;
    this.env = process.env.NODE_ENV || 'development';
    this.routes = routes;
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(this.routes);
    if (process.env.NODE_ENV !== 'testing') this.initializeWhatsAppWeb(); // TODO : fix this
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

  private initializeWhatsAppWeb() {
    this.whatsappclient = new Client({
      authStrategy: new LocalAuth(),
    });
    this.whatsappclient.on('qr', async (qr: any) => {
      qrcode.generate(qr, { small: true });
      // console.log('QR RECEIVED', qr);
      try {
        console.log('New QR code generated');
        const message = `Scan the QR code to login to whatsapp account \n\nhttps://dashboard.render.com/web/srv-clkt2gsjtl8s73f24g00/logs?m=max\n\n`;
        await sendMailer(env.DEVELOPER_EMAIL, 'Whatsapp QR Code', message);
      } catch (err) {
        console.log(err);
      }
    }),
      this.whatsappclient.on('ready', () => {
        console.log('Client is ready!');
        (global as any)['myGlobalVar'] = true;
      });
    this.whatsappclient.on('authenticated', () => console.log('Authenticated'));
    this.whatsappclient.on('disconnected', () => {
      console.log('Client is disconnected!');
    });

    this.whatsappclient.on('auth_failure', () => {
      console.log('Client is auth_failure!');
    });

    this.whatsappclient.on('message', async (message: any) => {
      try {
        // process.env.PROCCESS_MESSAGE_FROM_CLIENT &&
        if (message.from != 'status@broadcast') {
          const contact = await message.getContact();
          console.log(contact.pushname, message.from);
          // console.log(message.from);
          if (message.body === 'ping') {
            await message.reply('pong');
            await this.whatsappclient.sendMessage(message.from, 'pong');
          } else {
            await this.whatsappclient.sendMessage(
              message.from,
              `👋 Hello ${message._data.notifyName}` +
              "\n\nNeed help or have questions? Don't hesitate to reach out to our dedicated customer service team – they're here for you!\n📞 Call +201146238572 or email support@fixflex.tech for assistance."
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    });

    this.whatsappclient.initialize();
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
