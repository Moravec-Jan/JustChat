import {User} from "../users/user";

export interface RemoteMessage {
  author: User;
  target: User;
  body: string;
}
