import {Component} from '@angular/core';
import {AuthenticatorService} from "./autheticator/AuthenticatorService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public constructor(private authenticatorService: AuthenticatorService) {
  }

  public get username(): string {
    return this.authenticatorService.username;
  }
}
