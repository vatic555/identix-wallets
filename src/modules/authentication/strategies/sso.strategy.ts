import { Strategy } from "passport-custom";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthenticationService } from "../services/authentication.service";
import { Did } from "@/libs/sso-client/types";
import { Headers } from "@/modules/authentication/types";
import { Request } from "express";
import { existsSync, readFile } from "fs";
import { promisify } from "util";
import * as process from "process";

const readFileAsync = promisify(readFile);

interface ExtendedRequest extends Request {
  userDid: Did;
}
@Injectable()
export class SsoStrategy extends PassportStrategy(Strategy, "sso") {
  private readonly authTokenHeaderName: string;
  private authTokens: {[key: string]: string};

  constructor(private authService: AuthenticationService) {
    super();
    this.authTokenHeaderName = process.env.AUTH_TOKEN_HEADER_NAME || "Authorization";
    (async () => await this.initAuthenticationTokens())();
  }

  async validate(request: ExtendedRequest): Promise<Did> {
    const headers = this.getHeaders(request);

    if (!headers || !headers[this.authTokenHeaderName]) {
      throw new UnauthorizedException();
    }

    const authToken = String(headers[this.authTokenHeaderName]);

    const clientDid = this.checkAuthTokenAsClient(authToken);
    if (clientDid) {
      return clientDid;
    }

    const userDid = await this.authService.validateUserSession(authToken);

    if (!userDid) {
      throw new UnauthorizedException();
    }

    request.userDid = userDid;

    return userDid;
  }

  getHeaders(request: Request): Headers {
    if (
      !request.rawHeaders ||
      !Array.isArray(request.rawHeaders) ||
      request.rawHeaders.length === 0
    ) {
      return {};
    }

    return request.rawHeaders.reduce((result, current, index) => {
      if (index % 2 === 0) {
        result[request.rawHeaders[index]] = request.rawHeaders[index + 1];
        return result;
      }
      return result;
    }, {});
  }

  async initAuthenticationTokens(): Promise<void> {
    const authTokensPath = process.env.AUTHENTICATION_TOKENS_PATH || '';

    const fullAuthTokensPath = `${process.cwd()}/${authTokensPath}`;
    if (!existsSync(fullAuthTokensPath)) {
      throw new Error(
        `Authentication module configuration is invalid: authorization tokens path is incorrect!`
      );
    }

    try {
      const authTokensJson = await readFileAsync(fullAuthTokensPath);
      this.authTokens = JSON.parse(authTokensJson.toString());
    } catch (e) {
      throw new Error(`Authorization tokens are invalid: ${e.message}`);
    }
  }

  checkAuthTokenAsClient(token: string): Did|undefined {
    const client = Object.entries(this.authTokens)
      .filter(didTokenPair => {
        const [_, clientToken] = didTokenPair;
        return token === clientToken
      })
      .shift();

    const [clientDid, _] = client || [];
    return clientDid;
  }
}
