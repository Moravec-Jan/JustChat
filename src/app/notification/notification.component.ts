import {Component, OnInit} from '@angular/core';
import {AuthenticatorService} from "../autheticator/authenticator.service";

@Component({
  templateUrl: './notification.component.html',
  selector: 'app-notification',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(private authorizationService: AuthenticatorService) {
  }

  ngOnInit() {
  }

  get name(): string {
    return this.authorizationService.username;
  }

  get guest(): boolean {
    return this.authorizationService.guest;
  }


}
