import {
  AfterViewInit, Component, QueryList, ViewChild, OnInit, ViewChildren
} from '@angular/core';

import {MatTab, MatTabGroup} from '@angular/material';
import {ConversationService} from "./conversation.service";
import {Conversation} from "./conversation";
import {AuthenticatorService} from "../autheticator/AuthenticatorService";
import {User} from "../users/user";
import {selectValueAccessor} from "@angular/forms/src/directives/shared";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit {

  public messageInput: string;
  private canSend: boolean = false;
  public selection: number = 0;
  @ViewChild(MatTabGroup)
  public tabGroup: MatTabGroup; // bind tagGroup component to this variable


  public constructor(private conversationService: ConversationService, private authenticatorService: AuthenticatorService) {

    this.conversationService.onUserClickEmitter.subscribe((user: User) => {
      let conversation: Conversation = conversationService.conversations.getValue().find((conversation) => conversation.user.id === user.id);
      if (!conversation) {
        conversation = {user: user, messages: []};
        conversationService.addConversation(conversation);
      }
      this.selectTab(conversation);
    });

    this.conversations.subscribe((value: Conversation[]) => {
      this.canSend = value.length > 0;
    })
  }

  private selectTab(conversation) {
    const index: number = this.conversations.getValue().indexOf(conversation);
    if (index || index === 0) {
      this.selection = index;
    }
  }


  public get conversations(): BehaviorSubject<Conversation[]> {
    return this.conversationService.conversations;
  }

  public ngOnInit() {
    this.canSend = this.conversations.getValue().length > 0;
  }

  public getCurrentConversation(): Conversation {
    return this.conversations.getValue()[this.selection];
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
      this.conversationService.addMessage({id: "currentUser", name: this.authenticatorService.username}
        , currentConversation, this.messageInput);
      this.messageInput = "";
    }
  }
}

