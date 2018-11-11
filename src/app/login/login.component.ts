import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  public registerPasswordInput: String;
  public loginEmailInput: String;
  public loginPasswordInput: String;
  public registerNameInput: String;
  public registerEmailInput: String;

  constructor() {
  }

  public register() {

  }

  public login() {
  }

  ngAfterViewInit(): void {

  }
}
