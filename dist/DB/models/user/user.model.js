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
