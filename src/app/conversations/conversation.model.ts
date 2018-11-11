import {UserModel} from "../users/user.model";
import {Message} from "./message";

export interface ConversationModel {
  user: UserModel;
  messages: Message[];
  notifications: number;
}
