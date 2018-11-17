import {AfterViewInit, Component, Injectable, OnInit} from '@angular/core';
import {AuthenticatorService} from "./autheticator/authenticator.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {SocketService} from "./socket/socket.service";
import {validate} from "codelyzer/walkerFactory/walkerFn";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@Injectable()
export class AppComponent {
  private lastRoute: string = '';

  public constructor(private socketService: SocketService, private authenticatorService: AuthenticatorService, private _router: Router) {
    socketService.onSocketErrorState.subscribe((value) => {
      if (value) {
        if (this.route !== "error") {
          this.lastRoute = this.route;
        }
        _router.navigateByUrl('error');
      } else {
        _router.navigateByUrl(this.lastRoute);
      }
    })
  }

  get error(): boolean {
    return this.socketService.error;
  }

  get route(): string {
    return this._router.url.substring(1);
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
    this.socketService.connect();
    this.authenticatorService.loginAsGuest();
  }

}
