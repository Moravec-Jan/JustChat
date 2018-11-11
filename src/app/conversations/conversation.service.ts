import {Conversation} from "./conversation";
import {User} from "../users/user";
import {Bot} from "../bot/Bot";
import {EventEmitter, Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {HodorBot} from "../bot/Hodor";
import * as socketIO from 'socket.io-client';
import {Message} from "./message";
import {RemoteMessage} from "./remote-message";
import {AppConfig} from "../app.config";
import {SocketService} from "../socket/socket.service";

@Injectable()
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

  public constructor(private socketService: SocketService) {
    this.bots.push(new HodorBot()); //add desirable bots
    socketService.socket.on(SocketService.NEW_MESSAGE_ID, (data: RemoteMessage) => this.onReceiveMessage(data)); // set callback
  }

  private onReceiveMessage(data: RemoteMessage) {
    const target: Conversation = this._conversations.find((conversation: Conversation) => conversation.user.id === data.author.id)
    if (!target) {
      this.addConversation({ // if conversation doesnt exist, create it
        messages: [{
          author: data.author.name,
          body: data.body
        }],
        user: data.author
      })
    }
    target.messages.push({author: data.author.name, body: data.body}); // add message
  }

  public get conversations(): BehaviorSubject<Conversation[]> { // return conversations as Observable
    return new BehaviorSubject(this._conversations);
  }

  public addConversation(item: Conversation) {
    this._conversations.push(item);
  }

  public addMessage(user: User, conversation: Conversation, text: string) {
    conversation.messages.push({author: user.name, body: text});

    const result: Bot = this.bots.find((bot) => bot.id === conversation.user.id); //find out if target is bot
    if (result) {
      result.onMessageAdd(this, user, conversation); //send message to bot
    } else {
      const message: RemoteMessage = {author: user, target: conversation.user, body: text};
      this.socketService.socket.emit(SocketService.NEW_MESSAGE_ID, message); //send message to user via socket
    }

  }

  public show(user: User) {
    this.onUserClickEmitter.emit(user);
  }
}

