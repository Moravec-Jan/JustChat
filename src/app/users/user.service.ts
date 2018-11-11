import {UserModel} from "./user.model";
import {AuthenticatorService} from "../autheticator/authenticator.service";
import {Injectable} from "@angular/core";
import {SocketService} from "../socket/socket.service";

@Injectable()
export class UserService {
  private _users: UserModel[] = [{id: "0", name: "Hodor"}];

  public constructor(private socketService: SocketService) {
    socketService.socket.on(SocketService.USER_LOGGED_IN_ID, (user: UserModel) => this.add(user));
    socketService.socket.on(SocketService.USER_LOGGED_OUT_ID, (user: id) => this.removeById(user.id));
  }

  public get users(): UserModel[] {
    return this._users;
  }

  public add(item: UserModel) {
    this.users.push(item);
  }

  public addRange(users: UserModel[]) {
    this.users.concat(users);
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

interface id {
  id: string
}
