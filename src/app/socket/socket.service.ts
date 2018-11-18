import * as socketIO from "socket.io-client";
import {AppConfig} from "../app.config";
import {CookieService} from "ngx-cookie-service";
import {EventEmitter, Injectable, OnInit} from "@angular/core";
import Socket = SocketIOClient.Socket;
import {Router} from "@angular/router";

@Injectable()
export class SocketService implements OnInit {
  public static readonly NEW_MESSAGE_ID = 'new_message';
  public static readonly MESSAGE_INFO_ID = 'message_info';

  public static readonly GUEST_LOGIN_REQUEST_ID = 'guest_login';

  public static readonly USER_LOGIN_REQUEST_ID = 'user_login';

  public static readonly OTHER_USER_LOGGED_IN_ID = 'user_logged_in';
  public static readonly OTHER_USER_STATE_CHANGED = 'user_stated_changed';
  public static readonly OTHER_USER_LOGGED_OUT_ID = 'user_logged_out';

  public static readonly REGISTER_REQUEST_ID = 'register_request';
  public static readonly LOGOUT_REQUEST_ID = "logout_request";


  private _onSocketConnected: EventEmitter<Socket> = new EventEmitter<Socket>();
  private _onSocketErrorState: EventEmitter<boolean> = new EventEmitter<boolean>();
  private _socket;
  private _error: boolean;
  private callbackSetUp: boolean = false;

  public constructor() {
  }

  private setErrorCallbacks() {
    this.socket.on('connect_error', () => {
      this.failed();
    });

    this.socket.on('connection', () => {
      this.success();
    });

    this.socket.on('connect', () => {
      this.success();
    });
    this.callbackSetUp = true;
  }

  private failed() {
    this._error = true;
    this._onSocketErrorState.emit(true);
  }

  private success() {
    this._onSocketConnected.emit(this._socket);
    this._onSocketErrorState.emit(false);
    this._error = false;
  }

  private connectSocket() {
    this._socket = socketIO(AppConfig.SERVER_URL); // connectSocket to server socket (for dev use AppConfig.SERVER_URL)
    if (this.callbackSetUp) {
      this.setErrorCallbacks();
    }
  }

  ngOnInit(): void {

  }

  get socket() {
    return this._socket;
  }

  get error(): boolean {
    return this._error;
  }

  get onSocketErrorState(): EventEmitter<boolean> {
    return this._onSocketErrorState;
  }

  get onSocketConnected(): EventEmitter<SocketIOClient.Socket> {
    return this._onSocketConnected;
  }

  public connect() {
    if (!this.socket || !this._socket.connect()) {
      this.connectSocket();
    }
  }
}
