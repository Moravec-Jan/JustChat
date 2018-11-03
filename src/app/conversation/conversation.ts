import {User} from "../users/user";
import {Message} from "./message";

export interface Conversation {
  user: User;
  messages: Message[];
  active: boolean;
}
