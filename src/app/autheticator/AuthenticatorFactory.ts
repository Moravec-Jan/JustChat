import {AuthenticatorService} from "./AuthenticatorService";

export function AuthenticatorFactory(service: AuthenticatorService) {
  return () => service.login();
}
