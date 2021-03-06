import {Component, OnInit} from '@angular/core';
import {AuthenticatorService} from "../autheticator/authenticator.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {

  constructor(private authenticatorService: AuthenticatorService) {
  }

  ngOnInit() {
  }

  get logged() {
    return this.authenticatorService.logged;
  }
}
