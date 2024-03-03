"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const interfaces_1 = require("../../interfaces");
let userSchema = new mongoose_1.Schema({
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
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetCodeExpiration: Date,
    passwordResetVerified: Boolean,
    profilePicture: {
        type: Object,
        default: {
            url: null,
            publicId: null,
        },
    },
    role: {
        type: String,
        enum: Object.values(interfaces_1.UserType),
        default: interfaces_1.UserType.USER,
    },
    active: {
        type: Boolean,
        default: true,
    },
    phoneNumber: {
        type: String,
        unique: true,
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
}, { timestamps: true });
// TODO: add a pre save hook to hash the password before saving the user
// TODO: change the passwordChangedAt field when the user changes his password or when the user resets his password
// TODO: change user._id from ObjectId to string
let User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
