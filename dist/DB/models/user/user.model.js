"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_interface_1 = require("../../../interfaces/user.interface");
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
        enum: Object.values(user_interface_1.UserType),
        default: user_interface_1.UserType.USER,
    },
    active: {
        type: Boolean,
        default: true,
    },
    ipAddress: String,
}, { timestamps: true });
let User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
