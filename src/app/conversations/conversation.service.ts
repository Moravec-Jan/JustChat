import {Conversation} from "./conversation";
import {User} from "../users/user";
import {Bot} from "../bot/Bot";
import {EventEmitter} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {HodorBot} from "../bot/Hodor";

export class ConversationService {
  public bots: Bot[] = [];
  public onUserClickEmitter: EventEmitter<User> = new EventEmitter<User>();

  private _conversations: Conversation[] = [
    {
      user: {
        id: "0",
        name: "Hodor"
      },
      messages: [
        {
          author: "Hodor",
          body: "Hodor"
        }
      ]
    }
  ];

  public constructor() {
    this.bots.push(new HodorBot(this));
  }

  public get conversations(): BehaviorSubject<Conversation[]> {
    return new BehaviorSubject(this._conversations);
  }

  public addConversation(item: Conversation) {
    this._conversations.push(item);
  }

  public addMessage(user: User, conversation: Conversation, text: string) {
    conversation.messages.push({author: user.name, body: text});

    const result: Bot = this.bots.find((bot) => bot.id === conversation.user.id);
    if (result) {
      result.onMessageAdd(user, conversation);
    } else {
    }

  }

  public show(user: User) {
    this.onUserClickEmitter.emit(user);
  }
}

