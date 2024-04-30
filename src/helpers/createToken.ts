import jwt from 'jsonwebtoken';

import env from '../config/validateEnv';

export const createAccessToken = (payload: string) => {
  const jwtSecret = env.ACCESS_TOKEN_SECRET_KEY;
  const jwtExpiration = env.ACCESS_TOKEN_KEY_EXPIRE_TIME;
  return jwt.sign({ userId: payload }, jwtSecret, { expiresIn: jwtExpiration });
};

export const createRefreshToken = (payload: string) => {
  const jwtSecret = env.REFRESH_TOKEN_SECRET_KEY;
  const jwtExpiration = env.REFRESH_TOKEN_KEY_EXPIRE_TIME;
  return jwt.sign({ userId: payload }, jwtSecret, { expiresIn: jwtExpiration });
};
