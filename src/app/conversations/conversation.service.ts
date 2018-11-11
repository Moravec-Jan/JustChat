import {ConversationModel} from "./conversation.model";
import {UserModel} from "../users/user.model";
import {BotModel} from "../bot/bot.model";
import {EventEmitter, Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {HodorBot} from "../bot/hodor.model";
import {RemoteMessage} from "./remote-message";
import {SocketService} from "../socket/socket.service";

@Injectable()
export class ConversationService {

  public bots: BotModel[] = [];
  public onUserClickEmitter: EventEmitter<UserModel> = new EventEmitter();
  public onMessageReceiveEmitter: EventEmitter<ConversationModel> = new EventEmitter();
  private _conversations: ConversationModel[] = [
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
      ],
      notifications: 0
    }
  ];

  public constructor(private socketService: SocketService) {
    this.bots.push(new HodorBot()); //add desirable bots
    socketService.socket.on(SocketService.NEW_MESSAGE_ID, (data: RemoteMessage) => this.onReceiveMessage(data)); // set callback
  }

  private onReceiveMessage(data: RemoteMessage) {
    let target: ConversationModel = this._conversations.find((conversation: ConversationModel) => conversation.user.id === data.author.id)
    if (!target) {  // if conversation doesnt exist, create it
      target = {
        messages: [],
        user: data.author,
        notifications: 0
      };
      this.addConversation(target)
    }
    target.messages.push({author: data.author.name, body: data.body}); // add message
    this.onMessageReceiveEmitter.emit(target);
    console.log(target.notifications);
  }

  public get conversations(): BehaviorSubject<ConversationModel[]> { // return conversations as Observable
    return new BehaviorSubject(this._conversations);
  }

  public addConversation(item: ConversationModel) {
    this._conversations.push(item);
  }

  public addMessage(user: UserModel, conversation: ConversationModel, text: string) {
    conversation.messages.push({author: user.name, body: text});

    const result: BotModel = this.bots.find((bot) => bot.id === conversation.user.id); //find out if target is bot
    if (result) {
      result.onMessageAdd(this, user, conversation); //send message to bot
    } else {
      const message: RemoteMessage = {author: user, target: conversation.user, body: text};
      this.socketService.socket.emit(SocketService.NEW_MESSAGE_ID, message); //send message to user via socket
    }

  }

  public show(user: UserModel) {
    this.onUserClickEmitter.emit(user);
  }
}

