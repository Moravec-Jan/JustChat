import {EventEmitter, Injectable} from "@angular/core";
import {UserModel} from "../users/user.model";
import {SocketService} from "../socket/socket.service";
import {UserService} from "../users/user.service";
import {LoggedData} from "./logged-data";
import {ConversationService} from "../conversations/conversation.service";
import {UserData} from "./user-data";

@Injectable()
export class AuthenticatorService {
  private _username: string;
  private _logged: boolean = false;
  private _guest: boolean = true; // logged as host
  private _onRegisterDataReceived: EventEmitter<LoggedData> = new EventEmitter();
  private _onLoginDataReceived: EventEmitter<LoggedData> = new EventEmitter();

  constructor(private socketService: SocketService, private conversationService: ConversationService, private userService: UserService) {
    socketService.socket.on(SocketService.OTHER_USER_LOGGED_IN_ID, (user: UserModel) => {
      //must be called in this order
      userService.add(user);
      conversationService.onUserLoggedIn(user);
    });
    socketService.socket.on(SocketService.OTHER_USER_LOGGED_OUT_ID, (user: UserModel) => {
      //must be called in this order
      conversationService.onUserLoggedOut(user);
      userService.removeById(user.id)
    });

    this.socketService.socket.on(SocketService.REGISTER_REQUEST_ID, (value) => {
      this.processLoginData(value);
      this._onRegisterDataReceived.emit(value);
    });

    this.socketService.socket.on(SocketService.USER_LOGIN_REQUEST_ID, (value) => {
      this.processLoginData(value);
      this._onLoginDataReceived.emit(value);
    })
  }

  private processLoginData(value) {
    if (value.status === 'success') {
      this._guest = false;
      this.onLogin(value);
    }
  }

  public get username(): string {
    return this._username;
  }

  get guest(): boolean {
    return this._guest;
  }

  get id(): string {
    return this.socketService.socket.id;
  }

  public onStart() {
    this.loginAsGuest();
  }

  get onLoginDataReceived(): EventEmitter<LoggedData> {
    return this._onLoginDataReceived;
  }

  get onRegisterDataReceived(): EventEmitter<LoggedData> {
    return this._onRegisterDataReceived;
  }

  public loginAsGuest() { // onStart as a guest  (value: LoggedInfo) => this.onLogin(value)
    this._guest = true;
    this.socketService.socket.emit(SocketService.GUEST_LOGIN_REQUEST_ID);
    this.socketService.socket.on(SocketService.GUEST_LOGIN_REQUEST_ID, (value) => {
      this.onLogin(value)
    });
  }

  public onLogin(value: LoggedData) {
    this._logged = true;
    this._username = value.name;
    this.userService.users = value.users;
  }

  get logged(): boolean {
    return this._logged;
  }

  public register(data: UserData) {
    this.socketService.socket.emit(SocketService.REGISTER_REQUEST_ID, data);
  }

  public loginUser(data) {
    this.socketService.socket.emit(SocketService.USER_LOGIN_REQUEST_ID, data);
  }
}

