import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { LoggingModule } from "@/libs/logging/logging.module";

import SSOClientConfigurationFactory from "./factories/sso-client-configuration.factory";
import { SSOClientProvider } from "./providers/sso-client.provider";
import { SsoClientService } from "@/libs/sso-client/services/sso-client.service";

@Module({
  imports: [
    ConfigModule.forFeature(SSOClientConfigurationFactory),
    LoggingModule.forRoot({ serviceName: "SSO Client" })
  ],
  providers: [SSOClientProvider, SsoClientService],
  exports: [SSOClientProvider]
})
export class SsoClientModule {}
