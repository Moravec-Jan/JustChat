import * as socketIO from "socket.io-client";
import {AppConfig} from "../app.config";
import {EventEmitter} from "@angular/core";
import {UserModel} from "../users/user.model";

export class SocketService {
  public static readonly NEW_MESSAGE_ID = 'new_message';
  public static readonly LOGIN_SUCCESS_ID = 'login_success';
  public static readonly GUEST_LOGIN_REQUEST_ID = 'guest';
  public static readonly USER_LOGGED_IN_ID = 'user_logged_in';
  public static readonly USER_LOGGED_OUT_ID = 'user_logged_out';
  public static readonly MESSAGE_INFO_ID = 'message_info';

  private readonly _socket;

  public constructor() {
    this._socket = socketIO(AppConfig.SERVER_URL); // connect to server socket
  }

  get socket() {
    return this._socket;
  }
}
