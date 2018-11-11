import {User} from "./user";
import {AuthenticatorService} from "../autheticator/AuthenticatorService";
import {Injectable} from "@angular/core";
import {SocketService} from "../socket/socket.service";

@Injectable()
export class UserService {


  public constructor(private authenticatorService: AuthenticatorService, private socketservice: SocketService) {
    socketservice.socket.on(SocketService.USER_LOGGED_IN_ID, (user: User) => this.add(user));
    socketservice.socket.on(SocketService.USER_LOGGED_OUT_ID, (user: id) => this.removeById(user.id));
  }

  public get users(): User[] {
    return this.authenticatorService.users;
  }

  public add(item: User) {
    this.users.push(item);
  }

  public remove(item: User) {
    const index = this.users.indexOf(item);
    if (index > -1) {
      this.users.splice(index, 1);
    }
  }

  public removeById(id: string) {
    const item: User = this.users.find((user) => user.id === id);
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
