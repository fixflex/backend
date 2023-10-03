import { Document, Schema, model } from 'mongoose';

import { IAdmin } from '../../interfaces/User.interface';

let clientSchema: Schema<IAdmin & Document> = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'first name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'last name is required'],
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      minlength: 5,
      maxlength: 100,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: 'admin',
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

let Admin = model<IAdmin & Document>('Client', clientSchema);

export default Admin;
