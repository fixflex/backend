import { Schema, model } from 'mongoose';

import { IUser, UserType } from '../../interfaces/user.interface';

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
      // a regular expression to validate an email address(stackoverflow)
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      maxLength: [128, "Email can't be greater than 128 characters"],
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      trim: true,
      minlength: [6, 'Password must be more than 6 characters'],
    },

    passwordChangedAt: Date, // used to check if the user changed his password after the token was issued
    passwordResetCode: String, // used to reset the password
    passwordResetCodeExpiration: Date, // used to check if the reset code is expired or not
    passwordResetVerified: Boolean, // used to check if the reset code is verified or not

    profilePicture: {
      type: Object,
      default: {
        url: null,
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
