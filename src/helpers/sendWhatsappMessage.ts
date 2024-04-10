import { app } from '../';
import HttpException from '../exceptions/HttpException';

async function sendWhatsappMessage(phoneNumber: string, message: string) {
  //  Check if the Client is ready (whatsappclient)
  if (!(global as any)['myGlobalVar']) throw new HttpException(500, 'Something went wrong, please try again later');
  phoneNumber = phoneNumber.replace(/^0/, '20') + '@c.us';
  await app.whatsappclient.sendMessage(phoneNumber, message);
  return true;
}

export { sendWhatsappMessage };
