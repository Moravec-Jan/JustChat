import {Injectable} from "@angular/core";
import {UserModel} from "../users/user.model";
import {AppConfig} from "../app.config";
import {SocketService} from "../socket/socket.service";
import {UserService} from "../users/user.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoggedData} from "./logged-data";
import {RequestOptions} from "@angular/http";

@Injectable()
export class AuthenticatorService {
  private _username: string;
  private _logged: boolean = false;
  private _guest: boolean = true; // logged as host

  constructor(private socketService: SocketService, private userService: UserService, private http: HttpClient) {
  }

  public get username(): string {
    return this._username;
  }


  get id(): string {
    return this.socketService.socket.id;
  }

  public onStart() {
    this.loginAsGuest();
  }

  public loginAsGuest() { // onStart as a guest  (value: LoggedInfo) => this.onLogin(value)
    this._guest = true;
    this.socketService.socket.emit(SocketService.GUEST_LOGIN_REQUEST_ID);
    this.socketService.socket.on(SocketService.LOGIN_SUCCESS_ID, (value) => {
      this.onLogin(value)
    });
  }

  public onLogin(value: LoggedData) {
    this._logged = true;
    this._username = value.name;
    this.userService.addRange(value.users);
  }

  get logged(): boolean {
    return this._logged;
  }
}

