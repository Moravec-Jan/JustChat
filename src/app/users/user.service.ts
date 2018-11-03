import {User} from "./user";

export class UserService {
  private _users: User[] = [
    {"id": "1", "name": "Rodrigo"},
    {"id": "2", "name": "Marco"},
    {"id": "3", "name": "Ginny"}
  ];

  public constructor() {
  }

  public get users(): User[] {
    return this._users;
  }

  public add(item: User) {
    this._users.push(item);
  }

  public remove(item: User) {
    const index = this._users.indexOf(item);
    if (index > -1) {
      this._users.splice(index, 1);
    }
  }
}


