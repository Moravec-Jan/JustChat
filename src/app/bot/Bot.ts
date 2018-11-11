import {User} from "../users/user";
import {Conversation} from "../conversations/conversation";
import {ConversationService} from "../conversations/conversation.service";

export abstract class Bot {
  public abstract get id(): string;

  public abstract onMessageAdd(conversationService: ConversationService, user: User, targetConversation: Conversation)
}
