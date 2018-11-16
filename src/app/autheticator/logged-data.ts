import {UserModel} from "../users/user.model";

export interface LoggedData {
  name: string,
  users: UserModel[];
  status: string;
}
