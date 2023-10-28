import { config } from 'dotenv';
import { cleanEnv, port, str, url } from 'envalid';

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
  JWT_SECRET_KEY: str(),
  JWT_EXPIRATION: str(),
  CLOUDINARY_API_SECRET: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_CLOUD_NAME: str(),
});

export default validateEnv;
