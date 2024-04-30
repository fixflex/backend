// WhatsAppClient.ts
import qrcode from 'qrcode-terminal';
import { Client, LocalAuth } from 'whatsapp-web.js';

import env from '../config/validateEnv';
import HttpException from '../exceptions/HttpException';
import { sendMailer } from '../helpers';

class WhatsAppClient {
  private static instance: WhatsAppClient | null = null;
  private static whatsappClient: Client;

  private constructor() {
    WhatsAppClient.whatsappClient = new Client({
      authStrategy: new LocalAuth(),
      webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${env.WEB_VERSION}.html`,
      },
    });

    WhatsAppClient.whatsappClient.on('qr', async (qr: string) => {
      qrcode.generate(qr, { small: true });
      let flag = true;
      try {
        console.log('New QR code generated');
        if (flag) {
          flag = false;
          const message = `Scan the QR code to login to WhatsApp account \n\nhttps://dashboard.render.com/web/srv-clkt2gsjtl8s73f24g00/logs?m=max\n\n`;
          await sendMailer(env.DEVELOPER_EMAIL, 'WhatsApp QR Code', message);
        }
      } catch (err) {
        console.log(err);
      }
    });

    WhatsAppClient.whatsappClient.on('ready', () => {
      console.log('Client is ready!');
      (global as any)['myGlobalVar'] = true;
    });

    WhatsAppClient.whatsappClient.on('authenticated', () => console.log('Authenticated'));
    WhatsAppClient.whatsappClient.on('disconnected', () => {
      console.log('Client is disconnected!');
    });
    WhatsAppClient.whatsappClient.on('auth_failure', () => {
      console.log('Client is auth_failure!');
    });

    WhatsAppClient.whatsappClient.on('message', async (message: any) => {
      try {
        if (message.from !== 'status@broadcast') {
          const contact = await message.getContact();
          console.log(contact.pushname, message.from);
          if (message.body === 'ping') {
            await message.reply('pong');
            await WhatsAppClient.whatsappClient.sendMessage(message.from, 'pong');
          } else {
            await WhatsAppClient.whatsappClient.sendMessage(
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

    WhatsAppClient.whatsappClient.initialize();
  }

  public static getInstance(): WhatsAppClient {
    if (!WhatsAppClient.instance) {
      WhatsAppClient.instance = new WhatsAppClient();
    }
    return WhatsAppClient.instance;
  }

  public getWhatsAppClient(): Client {
    return WhatsAppClient.whatsappClient;
  }
  // make public static async sendMessage(phoneNumber: string, message: string) {

  public static async sendMessage(phoneNumber: string, message: string) {
    if (!(global as any)['myGlobalVar']) throw new HttpException(500, 'Something went wrong, please try again later');
    phoneNumber = phoneNumber.replace(/^0/, '20') + '@c.us';
    await WhatsAppClient.whatsappClient.sendMessage(phoneNumber, message);

    return true;
  }
}

export { WhatsAppClient };
