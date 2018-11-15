import {ConversationModel} from "./conversation.model";
import {UserModel} from "../users/user.model";
import {BotModel} from "../bot/bot.model";
import {EventEmitter, Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {HodorBot} from "../bot/hodor.model";
import {RemoteMessage} from "./remote-message";
import {SocketService} from "../socket/socket.service";
import {MessageInfo} from "./message-info";
import {Message} from "./message";

@Injectable()
export class ConversationService {
  private static counter = 0;
  public bots: BotModel[] = [];
  public onUserClickEmitter: EventEmitter<UserModel> = new EventEmitter();
  public onMessageReceiveEmitter: EventEmitter<ConversationModel> = new EventEmitter();
  private _conversations: ConversationModel[] = [
    {
      user: {
        id: "0",
        name: "Hodor"
      },
      messages: [],
      notifications: 0
    }
  ];

  public constructor(private socketService: SocketService) {
    this.bots.push(new HodorBot()); //add desirable bots
    socketService.socket.on(SocketService.NEW_MESSAGE_ID, (data: RemoteMessage, callback) => this.onReceiveMessage(data,callback)); // set callback
    socketService.socket.on(SocketService.MESSAGE_INFO_ID, (data: MessageInfo) => this.onMessageInfoReceived(data));
  }

  private onReceiveMessage(data: RemoteMessage,callback) {
    callback();
    let target = this.findConversationForUserId(data.author.id);
    if (!target) {  // if conversation doesnt exist, create it
      target = {
        messages: [],
        user: data.author,
        notifications: 0
      };
      this.addConversation(target)
    }
    target.messages.push({id: data.id, status: "success", author: data.author.name, body: data.body}); // add message
    this.onMessageReceiveEmitter.emit(target);
    console.log(target.notifications);
  }

  private findConversationForUserId(userId: String) {
    return this._conversations.find((conversation: ConversationModel) => conversation.user.id === userId);
  }

  public get conversations(): ConversationModel[] { // return conversations as Observable
    return this._conversations;
  }

  public addConversation(item: ConversationModel) {
    this._conversations.push(item);
  }

  public sendMessage(user: UserModel, conversation: ConversationModel, text: string) {
    const messageId = ConversationService.counter++;
    conversation.messages.push({id: messageId, author: user.name, body: text, status: "unknown"});

    const result: BotModel = this.bots.find((bot) => bot.id === conversation.user.id); //find out if target is bot
    if (result) {
      result.onMessageAdd(this, user, conversation); //send message to bot
    } else {
      const message: RemoteMessage = {
        id: messageId,
        author: user,
        target: conversation.user,
        body: text
      };
      this.socketService.socket.emit(SocketService.NEW_MESSAGE_ID, message); //send message to user via socket
    }
  }

  public show(user: UserModel) {
    this.onUserClickEmitter.emit(user);
  }


  private onMessageInfoReceived(data: MessageInfo) {
    const conversation = this.findConversationForUserId(data.target);
    if (conversation) {
      conversation.messages.forEach((value, index) => {
        if (value.id === data.id) {
          conversation.messages[index] = {id: value.id, author: value.author, body: value.body, status: data.state}  // for change detection
        }
      })
    }
  }
}

