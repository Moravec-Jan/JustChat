import {User} from "../users/user";
import {Conversation} from "../conversations/conversation";

export abstract class Bot{
  public abstract get id(): string;
  public abstract onMessageAdd(user: User,targetConversation: Conversation)
}
