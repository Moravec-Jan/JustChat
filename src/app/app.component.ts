import {Component, Injectable} from '@angular/core';
import {AuthenticatorService} from "./autheticator/authenticator.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@Injectable()
export class AppComponent {

  public constructor(private authenticatorService: AuthenticatorService, private _router: Router) {
  }

  get route(): string{
    return this._router.url;
  }

  public get username(): string {
    return this.authenticatorService.username;
  }

  public get isGuest(): boolean {
    return this.authenticatorService.guest;
  }
}
