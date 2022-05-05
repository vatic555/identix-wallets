import {
  Inject,
  Injectable,
  BadRequestException,
  UnauthorizedException
} from "@nestjs/common";

import { SSOClient, ISSOClient, Did } from "@/libs/sso-client/types";

@Injectable()
export class AuthenticationService {
  constructor(@Inject(SSOClient) private ssoClient: ISSOClient) {}

  public async validateUserSession(userSessionDid: Did): Promise<Did> {
    return this.ssoClient.validateUserSession(userSessionDid);
  }
}
