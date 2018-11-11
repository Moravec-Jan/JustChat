import {Injectable} from "@angular/core";
import {UserModel} from "../users/user.model";
import {AppConfig} from "../app.config";
import {SocketService} from "../socket/socket.service";
import {UserService} from "../users/user.service";

@Injectable()
export class AuthenticatorService {
  private _username: string;
  private _logged: boolean = false;
  private _host: boolean = true; // logged as host

  constructor(private socketService: SocketService, private userService: UserService) {
  }

  public get username(): string {
    return this._username;
  }


  get id(): string {
    return this.socketService.socket.id;
  }

  public login() {
    this.socketService.socket.emit(SocketService.LOGIN_REQUEST_ID);
    this.socketService.socket.on(SocketService.LOGIN_REQUEST_ID, (value) => {
      this.onLogin(value)
    })
  }

  public onLogin(value: LoggedInfo) {
    this._logged = true;
    this._username = value.name;
    this.userService.addRange(value.users);
  }


  get logged(): boolean {
    return this._logged;
  }
}

export interface LoggedInfo {
  name: string,
  users: UserModel[]
}

