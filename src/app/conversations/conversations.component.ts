import {
  AfterViewInit, Component, QueryList, ViewChild, OnInit, ViewChildren
} from '@angular/core';

import {MatTab, MatTabGroup} from '@angular/material';
import {ConversationService} from "./conversation.service";
import {ConversationModel} from "./conversation.model";
import {AuthenticatorService} from "../autheticator/authenticator.service";
import {UserModel} from "../users/user.model";


@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit {
  private readonly audio = new Audio("assets/stairs.mp3");
  public messageInput: string;
  private _canSend: boolean = false;
  private _selection: number = 0;

  @ViewChild(MatTabGroup)
  public tabGroup: MatTabGroup; // bind tagGroup component to this variable

  get selection(): number {
    return this._selection;
  }

  set selection(value: number) {
    this._selection = value;
    this.resetNotification(value);
  }

  public get conversations(): ConversationModel[] {
    return this.conversationService.conversations;
  }

  get canSend(): boolean {
    return this._canSend;
  }

  public constructor(private conversationService: ConversationService, private authenticatorService: AuthenticatorService) {

    this.conversationService.onUserClickEmitter.subscribe((user: UserModel) => {
      let conversation: ConversationModel = conversationService.conversations.find((conversation) => conversation.user.id === user.id);
      if (!conversation) {
        conversation = {user: user, messages: [], notifications: 0};
        conversationService.addConversation(conversation);
        this.updateCanSendStatus();
      }
      this.selectTab(conversation);
    });

    this.conversationService.onMessageReceiveEmitter.subscribe((conversation: ConversationModel) => {
      this.OnNewMessageReceived(conversation);
    });
  }

  private OnNewMessageReceived(conversation: ConversationModel) {
    let currentConversation = this.getCurrentConversation();
    if (!currentConversation) {
      this.selectTab(conversation); // if noting is selected, select new one
    } else if (conversation.user.id !== currentConversation.user.id) {
      conversation.notifications = conversation.notifications + 1; // if message has been received to other conversation, lets add notification
    }
    this.playNotificationSound();
  }

  private playNotificationSound() {
    this.audio.play();
  }

  private selectTab(conversation) {
    const index: number = this.conversations.indexOf(conversation);
    if (index || index === 0) {
      this.selection = index;
    }
  }

  public ngOnInit() {
    this._canSend = this.conversations.length > 0;
  }

  public getCurrentConversation(): ConversationModel {
    return this.conversations[this._selection];
  }

  public closeConversation(index: number) {
    this.conversations.splice(index, 1);
    this.updateCanSendStatus();
  }

  private updateCanSendStatus() {
    this._canSend = this.conversations.length > 0; // update canSend
  }

  public onSubmit() {
    this.addMessage();
  }

  public addMessage() {
    if (!this.messageInput || this.messageInput === "") {
      return;
    }
    const currentConversation = this.getCurrentConversation();
    if (currentConversation) {
      this.conversationService.sendMessage({id: this.authenticatorService.id, name: this.authenticatorService.username}
        , currentConversation, this.messageInput);
      this.messageInput = "";
    }
  }

  private resetNotification(value: number) {
    try {
      this.conversations[value].notifications = 0;
    } catch (e) {
      console.log(e);
    }
  }

  public onKeydown(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // prevent newline
      this.onSubmit(); //submit message
    }
  }
}

