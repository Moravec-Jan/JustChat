import {UserModel} from "./user.model";
import {AuthenticatorService} from "../autheticator/authenticator.service";
import {Injectable} from "@angular/core";
import {SocketService} from "../socket/socket.service";
import {BotModel} from "../bot/bot.model";
import {validate} from "codelyzer/walkerFactory/walkerFn";

@Injectable()
export class UserService {
  private _bots: UserModel[] = [{id: "0", name: "Hodor"}];
  private _users: UserModel[] = [];

  public constructor(private socketService: SocketService) {
    this._users = this._users.concat(this._bots);
  }

  public get users(): UserModel[] {
    return this._users;
  }

  public set users(value: UserModel[]) {
    this._users = value.concat(this._bots); // add bots too
  }

  public add(item: UserModel) {
    const existing = this._users.find((value) => {
      return value.id === item.id
    });
    if (!existing) {
      this.users.push(item);
    } else {
      existing.name = item.name;
    }
  }

  public addRange(users: UserModel[]) {
    this._users = this.users.concat(users);
  }

  public remove(item: UserModel) {
    const index = this.users.indexOf(item);
    if (index > -1) {
      this.users.splice(index, 1);
    }
  }

  public removeById(id: string) {
    const item: UserModel = this.users.find((user) => user.id === id);
    if (!item) {
      return;
    }
    const index = this.users.indexOf(item);
    if (index > -1) {
      this.users.splice(index, 1);
    }
  }

}
