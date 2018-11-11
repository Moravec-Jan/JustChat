import {Injectable} from "@angular/core";
import {User} from "../users/user";
import {AppConfig} from "../app.config";
import {SocketService} from "../socket/socket.service";

@Injectable()
export class AuthenticatorService {
  private _username: string;
  private _users: User[] = [{id: "0", name: "Hodor"}];

  constructor(private socketService: SocketService) {
  }

  public get username(): string {
    return this._username;
  }


  get id(): string {
    return this.socketService.socket.id;
  }

  public get users(): User[] {
    return this._users;
  }

  public login() {
    this.socketService.socket.emit(SocketService.LOGIN_REQUEST_ID);
    this.socketService.socket.on(SocketService.LOGIN_REQUEST_ID, (value) => {
      this.onLogin(value)
    })
  }

  public onLogin(value: LoggedInfo) {
    this._username = value.name;
    this._users = this._users.concat(value.users);
  }
}

export interface LoggedInfo {
  name: string,
  users: User[]
}

