import {Component} from '@angular/core';
import {AuthenticatorService} from "./autheticator/authenticator.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public constructor(private authenticatorService: AuthenticatorService) {
  }

  public get logged() {
    return this.authenticatorService.logged;
  }

  public get username(): string {
    return this.authenticatorService.username;
  }
}
