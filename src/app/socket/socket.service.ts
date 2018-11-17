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
  public static readonly OTHER_USER_LOGGED_OUT_ID = 'user_logged_out';

  public static readonly REGISTER_REQUEST_ID = 'register_request';
  public static readonly LOGOUT_REQUEST_ID = "logout_request";


  private _onSocketConnected: EventEmitter<Socket> = new EventEmitter<Socket>();
  private _onSocketErrorState: EventEmitter<boolean> = new EventEmitter<boolean>();
  private _socket;
  private _error: boolean;

  public constructor(private cookieService: CookieService) {
    this.connect();

    this.socket.on('connect_error', () => {
      this.failed();
    });

    this.socket.on('connection', () => {
      this.success();
    });

    this.socket.on('reconnect', () => {
      this.success();
    });
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

  private connect() {
    const session = this.cookieService.get('connect.sid');
    if (!session) {
      // session id not recieved from server!
      this.failed();
    }
    this._socket = socketIO(AppConfig.SERVER_URL); // connect to server socket
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

  public reconnect() {
    if (!this._socket.connect()) {
      this.connect();
    }
  }
}
