import { Schema, model } from 'mongoose';

import { IUser, UserType } from '../../../interfaces/user.interface';

let userSchema: Schema<IUser> = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Name is required'],
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
    role: {
      type: String,
      enum: Object.values(UserType),
      default: UserType.USER,
    },
    active: {
      type: Boolean,
      default: true,
    },
    ipAddress: String,
  },
  { timestamps: true }
);

let User = model<IUser>('User', userSchema);

export default User;
