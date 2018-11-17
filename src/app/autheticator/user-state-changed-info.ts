import {UserModel} from "../users/user.model";

export class UserStateChangedInfo {
  from: UserModel;
  to: UserModel;
}
