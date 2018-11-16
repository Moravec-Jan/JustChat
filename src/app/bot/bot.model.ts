import {UserModel} from "../users/user.model";
import {ConversationModel} from "../conversations/conversation.model";
import {ConversationService} from "../conversations/conversation.service";

export abstract class BotModel {
  id: string;

  public abstract onMessageAdd(conversationService: ConversationService, user: UserModel, targetConversation: ConversationModel)
}
