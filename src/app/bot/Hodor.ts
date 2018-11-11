import {Injectable} from "@angular/core";
import {ConversationService} from "../conversations/conversation.service";
import {User} from "../users/user";
import {Bot} from "./Bot";
import {Conversation} from "../conversations/conversation";

@Injectable()
export class HodorBot extends Bot {
  public user: User = {id: "0", name: "Hodor"};

  public constructor() {
    super();
  }

  public get id() {
    return this.user.id;
  }

  public onMessageAdd(conversationService: ConversationService,fromUser: User, targetConversation: Conversation) {
    if (fromUser.id !== this.id) {
      conversationService.addMessage(this.user, targetConversation, "Hodor");
    }
  }

}
