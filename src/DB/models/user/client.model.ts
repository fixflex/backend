import { Document, Schema, model } from 'mongoose';

import { IClient } from '../../../interfaces/user.interface';

let clientSchema: Schema<IClient & Document> = new Schema(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

let Client = model<IClient & Document>('Client', clientSchema);

export default Client;
