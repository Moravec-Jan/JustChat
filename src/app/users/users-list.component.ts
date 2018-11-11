import {Component, OnInit} from '@angular/core';
import {UserService} from "./user.service";
import {ConversationService} from "../conversations/conversation.service";
import {UserModel} from "./user.model";
import {ConversationModel} from "../conversations/conversation.model";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  private userService: UserService;
  private conversationService: ConversationService;

  constructor(userService: UserService, conversationService: ConversationService) {
    this.userService = userService;
    this.conversationService = conversationService;
  }

  get users(): UserModel[] {
    return this.userService.users;
  }

  public ngOnInit() {

  }

  public onUserClick(user: UserModel) {
    this.conversationService.show(user)
  }
}
