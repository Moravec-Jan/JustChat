import {AuthenticatorService} from "./authenticator.service";
import {SocketService} from "../socket/socket.service";

export function SocketInit(service: SocketService) {
  return () => service.connect();
}
