import {AuthenticatorService} from "./authenticator.service";

export function AuthenticatorFactory(service: AuthenticatorService) {
  return () => service.login();
}
