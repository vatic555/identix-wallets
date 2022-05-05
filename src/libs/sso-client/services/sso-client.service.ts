import { Injectable } from "@nestjs/common";
import { ISSOClientService, ISsoNpmService } from "@/libs/sso-client/types";
import { Did } from "../types";
import { SsoService } from "identix-sso-client-js";
import { faker } from "@faker-js/faker";

@Injectable()
export class SsoClientService implements ISSOClientService {
  private ssoService: SsoService;

  init(ssoService: SsoService): void {
    this.ssoService = ssoService;
  }

  public async registerSession(clientDid: Did): Promise<Did> {
    // const otcDid = await this.ssoService.requestClientLogin(clientDid)
    // const signedOtcDid = 'signed_' + otcDid;
    // const sessionTokenDid = await this.ssoService.attemptClientLogin(clientDid, signedOtcDid);

    const sessionTokenDid = faker.random.alphaNumeric(30);
    return sessionTokenDid;
  }
  public async validateUserSession(
    clientSessionDid: Did,
    userSessionDid: Did
  ): Promise<Did> {
    //const userDid = await this.ssoService.validateUserSession(clientSessionDid, userSessionDid);

    const userDid = faker.random.alphaNumeric(30);
    return userDid;
  }
}
