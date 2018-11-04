import {User} from "./user";
import {AuthenticatorService} from "../autheticator/AuthenticatorService";
import {Injectable} from "@angular/core";

@Injectable()
export class UserService {

  public constructor(private authenticatorService: AuthenticatorService) {
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
}


