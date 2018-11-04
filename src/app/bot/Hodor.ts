import {Injectable} from "@angular/core";
import {ConversationService} from "../conversations/conversation.service";
import {User} from "../users/user";
import {Bot} from "./Bot";
import {Conversation} from "../conversations/conversation";

@Injectable()
export class HodorBot extends Bot {
  public user: User = {id: "0", name: "Hodor"};

  public constructor(private conversationService: ConversationService) {
    super();
  }

  public get id() {
    return this.user.id;
  }

  public onMessageAdd(fromUser: User, targetConversation: Conversation) {
    if (fromUser.id !== this.id) {
      this.conversationService.addMessage(this.user, targetConversation, "Hodor");
    }
  }

}
