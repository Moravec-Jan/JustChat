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
import {LoggedData} from "../autheticator/logged-data";
import {UserStateChangedInfo} from "../autheticator/user-state-changed-info";

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
    socketService.socket.on(SocketService.NEW_MESSAGE_ID, (data: RemoteMessage, callback) => this.onReceiveMessage(data, callback)); // set callback
    socketService.socket.on(SocketService.MESSAGE_INFO_ID, (data: MessageInfo) => this.onMessageInfoReceived(data));
  }

  private onReceiveMessage(data: RemoteMessage, callback) {
    callback(); // function from server that notify author of message that message has been delivered
    let target = this.findConversationForUserId(data.author.id);
    if (!target) {  // if conversation doesnt exist, create it
      target = {
        messages: [],
        user: data.author,
        notifications: 0
      };
      this.addConversation(target)
    }
    target.messages.push({system: false, id: data.id, status: "success", author: data.author.name, body: data.body}); // add message
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

  public addSystemMessage(user: UserModel, conversation: ConversationModel, text: string) {
    conversation.messages.push(this.createMessage(user.name, text, "success", true));
  }

  public sendMessage(user: UserModel, conversation: ConversationModel, text: string) {
    const bot: BotModel = this.bots.find((bot) => bot.id === conversation.user.id); //find out if target is bot
    if (bot) {
      this.sendMessageToBot(bot, user, conversation, text);
    } else {
      this.sendMessageToUser(user, text, conversation);
    }
  }

  private sendMessageToUser(user: UserModel, text: string, conversation: ConversationModel) {
    const message: Message = this.createMessage(user.name, text, "unknown", false);
    const remoteMessage = {
      id: message.id,
      target: conversation.user,
      body: text
    };
    this.socketService.socket.emit(SocketService.NEW_MESSAGE_ID, remoteMessage); //send message to user via socket
    conversation.messages.push(message);
  }

  public createMessage(author: string, body: string, status: string, system: boolean = false): Message {
    const id = ConversationService.counter++;
    return {system, id, author, body, status: status};
  }

  private sendMessageToBot(bot: BotModel, user: UserModel, conversation: ConversationModel, text: string) {
    conversation.messages.push(this.createMessage(user.name, text, "success", false));
    bot.onMessageAdd(this, user, conversation);
  }

  public show(user: UserModel) {
    this.onUserClickEmitter.emit(user);
  }


  private onMessageInfoReceived(data: MessageInfo) {
    const conversation = this.findConversationForUserId(data.target);
    if (conversation) {
      conversation.messages.forEach((value, index) => {
        if (value.id === data.id) {
          conversation.messages[index].status = data.state;
        }
      })
    }
  }

  public onUserLoggedIn(user: UserModel) {
    let conversation = this.findConversationForUserId(user.id);
    if (conversation) {
      conversation.user.name = user.name;
      this.addSystemMessage(this.getSystemUser(), conversation, user.name + " went online");
      this.onMessageReceiveEmitter.emit(conversation);
    }
  }

  public onUserStateChanged(info: UserStateChangedInfo) {
    let conversation = this.findConversationForUserId(info.from.id);
    if (conversation && info.from.name !== info.to.name) {
      this.addSystemMessage(this.getSystemUser(), conversation, info.from.name + " changed his name to " + info.to.name);
      this.onMessageReceiveEmitter.emit(conversation);
      conversation.user = info.to;
    }
  }


  private getSystemUser(): UserModel {
    return {id: "system", name: "System"};
  }

  public onUserLoggedOut(user: UserModel) {
    let conversation = this.findConversationForUserId(user.id);
    if (conversation) {
      this.addSystemMessage(this.getSystemUser(), conversation, conversation.user.name + " went offline");
      this.onMessageReceiveEmitter.emit(conversation);
    }
  }
}

