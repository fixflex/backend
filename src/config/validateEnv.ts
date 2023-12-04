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
  JWT_SECRET_KEY: str(),
  JWT_EXPIRATION: str(),
  CLOUDINARY_API_SECRET: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_CLOUD_NAME: str(),
  SALT_ROUNDS: num(),
});

export default validateEnv;
