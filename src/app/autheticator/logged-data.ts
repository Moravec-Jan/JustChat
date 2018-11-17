import {UserModel} from "../users/user.model";

export interface LoggedData {
  id: string;
  users: UserModel[];
  name: string,
  status: string;
}
