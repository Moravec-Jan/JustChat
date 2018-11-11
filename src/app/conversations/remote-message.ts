import {UserModel} from "../users/user.model";

export interface RemoteMessage {
  author: UserModel;
  target: UserModel;
  body: string;
}
