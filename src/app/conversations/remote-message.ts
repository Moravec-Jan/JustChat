import {UserModel} from "../users/user.model";

export interface RemoteMessage {
  id: number;
  author: UserModel;
  target: UserModel;
  body: string;
}
