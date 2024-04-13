import { Schema, model } from 'mongoose';

import { IUser, UserType } from '../../interfaces';

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

    phoneNumber: {
      type: String,
      unique: true,
      sparse: true, // use sparse index to allow multiple documents to have no value for the indexed field
      index: true,
      trim: true,
      match: [/^\d{11}$/, 'Please provide a valid phone number (11 digits)'],
    },
    phoneNumVerified: {
      type: Boolean,
      default: false,
    },
    phoneNumVerificationCode: String,
    phoneNumVerificationCodeExpiration: Date,

    ipAddress: String,
  },
  { timestamps: true }
);

// TODO: add a pre save hook to hash the password before saving the user
// TODO: change the passwordChangedAt field when the user changes his password or when the user resets his password
// TODO: change user._id from ObjectId to string

let User = model<IUser>('User', userSchema);

export default User;
