import { config } from 'dotenv';
import { cleanEnv, num, port, str, url } from 'envalid';

if (process.env.NODE_ENV === 'testing') {
  config({ path: '.env.test' });
} else {
  config();
}

const validateEnv = cleanEnv(process.env, {
  PORT: port(),
  NODE_ENV: str(),
  BASE_URL: url(),
  DB_URI: str(),
  ACCESS_TOKEN_SECRET_KEY: str(),
  REFRESH_TOKEN_SECRET_KEY: str(),
  ACCESS_TOKEN_KEY_EXPIRE_TIME: str(),
  REFRESH_TOKEN_KEY_EXPIRE_TIME: str(),
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
  CLOUDINARY_API_SECRET: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_CLOUD_NAME: str(),
  SALT_ROUNDS: num(),
  SMTP_NAME: str(),
  SMTP_USERNAME: str(),
  SMTP_PASSWORD: str(),
  SMTP_HOST: str(),
  SMTP_PORT: str(),
  DEVELOPER_EMAIL: str(),
  defaultLocale: str(),
  COMMISSION_RATE: num(),
  APP_ID: str(),
  API_KEY: str(),
  USER_AUTH_KEY: str(),
  PAYMOB_API_KEY: str(),
  PAYMOB_INTEGRATION_ID: num(),
});

export default validateEnv;
