import {
  AfterViewInit, Component, QueryList, ViewChild, OnInit, ViewChildren
} from '@angular/core';

import {MatTab, MatTabGroup} from '@angular/material';
import {ConversationService} from "./conversation.service";
import {ConversationModel} from "./conversation.model";
import {AuthenticatorService} from "../autheticator/authenticator.service";
import {UserModel} from "../users/user.model";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit {
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

  public get conversations(): BehaviorSubject<ConversationModel[]> {
    return this.conversationService.conversations;
  }

  get canSend(): boolean {
    return this._canSend;
  }

  public constructor(private conversationService: ConversationService, private authenticatorService: AuthenticatorService) {

    this.conversationService.onUserClickEmitter.subscribe((user: UserModel) => {
      let conversation: ConversationModel = conversationService.conversations.getValue().find((conversation) => conversation.user.id === user.id);
      if (!conversation) {
        conversation = {user: user, messages: [], notifications: 0};
        conversationService.addConversation(conversation);
      }
      this.selectTab(conversation);
    });

    this.conversationService.onMessageReceiveEmitter.subscribe((conversation: ConversationModel) => {
      this.OnNewMessageReceived(conversation);
    });

    this.conversations.subscribe((value: ConversationModel[]) => {
      this._canSend = value.length > 0;
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
    const audio = new Audio("assets/stairs.mp3");
    audio.play();
  }

  private selectTab(conversation) {
    const index: number = this.conversations.getValue().indexOf(conversation);
    if (index || index === 0) {
      this.selection = index;
    }
  }

  public ngOnInit() {
    this._canSend = this.conversations.getValue().length > 0;
  }

  public getCurrentConversation(): ConversationModel {
    return this.conversations.getValue()[this._selection];
  }

  public closeConversation(index: number) {
    this.conversations.getValue().splice(index, 1);
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
      this.conversationService.addMessage({id: this.authenticatorService.id, name: this.authenticatorService.username}
        , currentConversation, this.messageInput);
      this.messageInput = "";
    }
  }

  private resetNotification(value: number) {
    try {
      this.conversations.getValue()[value].notifications = 0;
    } catch (e) {
      console.log(e);
    }
  }
}

