import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../users/user";

@Injectable()
export class AuthenticatorService {
  private _username: string;
  private _users: User[] = [{id: "0", name: "Hodor"}];

  constructor(private http: HttpClient) {
  }

  public get username(): string {
    return this._username;
  }

  public get users(): User[] {
    return this._users;
  }

  public login() {
    this.http.get("http://private-257ab-justchat.apiary-mock.com/login").subscribe(
      value => this.onLogin(<LoggedInfo>value));
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

