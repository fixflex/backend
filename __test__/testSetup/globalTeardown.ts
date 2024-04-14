import mongoose from 'mongoose';

import { dbConnection } from '../../src/DB';

export default async () => {
  dbConnection();
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};
