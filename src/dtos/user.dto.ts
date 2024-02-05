// Purpose: User DTO for user data transfer.
import { IUser } from '../interfaces';

export class UserDto {
  constructor(user: IUser) {
    this._id = user._id!;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    // this.profilePicture = user.profilePicture.url;
  }

  readonly _id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  // readonly profilePicture: string | null;
}
