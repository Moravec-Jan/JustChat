import {AfterViewInit, Component, Injectable, OnInit} from '@angular/core';
import {AuthenticatorService} from "./autheticator/authenticator.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {SocketService} from "./socket/socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@Injectable()
export class AppComponent {

  public constructor(private socketService: SocketService, private authenticatorService: AuthenticatorService, private _router: Router, private  cookieService: CookieService) {
  }

  get route(): string {
    return this._router.url;
  }

  public get username(): string {
    return this.authenticatorService.username;
  }

  get logged() {
    return this.authenticatorService.logged;
  }

  public get isGuest(): boolean {
    return this.authenticatorService.guest;
  }

  onLogoutClick() {
    this.authenticatorService.logout();
  }

  loginAsGuest() {
    this.socketService.reconnect();
    this.authenticatorService.loginAsGuest();
  }
}
