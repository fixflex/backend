"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = void 0;
class UserDto {
    constructor(user) {
        this._id = user._id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.profilePicture = user.profilePicture.url;
    }
}
exports.UserDto = UserDto;
