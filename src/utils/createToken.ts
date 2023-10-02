import jwt from 'jsonwebtoken';

import env from '../config/validateEnv';

export const createToken = (payload: string) => {
  const jwtSecret = env.JWT_SECRET_KEY;
  const jwtExpiration = env.JWT_EXPIRATION;
  return jwt.sign({ userId: payload }, jwtSecret!, { expiresIn: jwtExpiration });
};
