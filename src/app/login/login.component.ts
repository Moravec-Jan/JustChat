import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {SocketService} from "../socket/socket.service";
import {AuthenticatorService} from "../autheticator/authenticator.service";
import {Router} from "@angular/router";
import {LoggedData} from "../autheticator/logged-data";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  public registerPasswordInput: string;
  public loginEmailInput: string;
  public loginPasswordInput: string;
  public registerNameInput: string;
  public registerEmailInput: string;
  public loginErrorMessage: string;
  public registerErrorMessage: string;

  constructor(private socketService: SocketService, private authenticatorService: AuthenticatorService, private router: Router) {
    authenticatorService.onRegisterDataReceived.subscribe((data) => {
      if (data.status === 'success') {
        this.registerErrorMessage = undefined;
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigateByUrl("");
      } else {
        this.registerErrorMessage = data.error;
      }
    });

    authenticatorService.onLoginDataReceived.subscribe((data) => {
      if (data.status === 'success') {
        this.loginErrorMessage = undefined;
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigateByUrl("");
      } else {
        this.loginErrorMessage = data.error;
      }
    })
  }

  public register() {
    this.authenticatorService.register({
      email: this.registerEmailInput,
      nickname: this.registerNameInput,
      password: this.registerPasswordInput
    });
  }

  public login() {
    this.authenticatorService.loginUser({email: this.loginEmailInput, password: this.loginPasswordInput});
  }

  ngAfterViewInit(): void {

  }
}
