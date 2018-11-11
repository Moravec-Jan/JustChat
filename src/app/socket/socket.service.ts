import * as socketIO from "socket.io-client";
import {AppConfig} from "../app.config";

export class SocketService {
  public static readonly NEW_MESSAGE_ID = 'new_message';
  public static readonly LOGIN_REQUEST_ID = 'login';
  public static readonly USER_LOGGED_IN_ID = 'user_logged_in';
  public static readonly USER_LOGGED_OUT_ID = 'user_logged_out';

  private readonly _socket;

  public constructor() {
    this._socket = socketIO(AppConfig.SERVER_URL); // connect to server socket
  }

  get socket() {
    return this._socket;
  }
}
