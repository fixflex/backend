import { Schema, model } from 'mongoose';

import env from '../../config/validateEnv';
import { encrypt } from '../../helpers';
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
      // match: [/^\d{11}$/, 'Please provide a valid phone number (11 digits)'],
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

// Middleware to encrypt phone number after fetching from DB
userSchema.post<IUser>(/^find/, function (result: IUser) {
  if (!result) return;
  console.log('from post find middleware =========>> ', result.phoneNumber);
  result.phoneNumber = encrypt(result.phoneNumber || '', env.ENCRYPTION_KEY);
});

let User = model<IUser>('User', userSchema);

export default User;
