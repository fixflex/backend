import { Document, Schema, model } from 'mongoose';

import { IClient } from '../../interfaces/User.interface';

let clientSchema: Schema<IClient & Document> = new Schema(
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
    profilePicture: {
      type: Object,
      default: {
        url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png',
        publicId: null,
      },
    },
    bio: {
      type: String,
    },

    role: 'client',
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

let Client = model<IClient & Document>('Client', clientSchema);

export default Client;
