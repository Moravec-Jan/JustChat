import {Injectable} from "@angular/core";
import {ConversationService} from "../conversations/conversation.service";
import {UserModel} from "../users/user.model";
import {BotModel} from "./bot.model";
import {ConversationModel} from "../conversations/conversation.model";

@Injectable()
export class HodorBot extends BotModel {
  public user: UserModel = {id: "0", name: "Hodor"};

  public constructor() {
    super();
  }

  public get id() {
    return this.user.id;
  }

  public onMessageAdd(conversationService: ConversationService, fromUser: UserModel, targetConversation: ConversationModel) {
    if (fromUser.id !== this.id) {
      conversationService.addMessage(this.user, targetConversation, "Hodor");
    }
  }

}
