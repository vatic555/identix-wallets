import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersEntity, VcStorageEntity, VcVerificationCasesEntity } from "@/libs/database/entities";
import { LoggingModule } from "@/libs/logging/logging.module";
import { VcStorageGraphqlApiService } from "./services/vc-storage.graphql-api.service";
import { VcStorageGraphqlApiResolvers} from "./resolvers/vc-storage.graphql-api.resolvers";

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, VcStorageEntity, VcVerificationCasesEntity]),
    LoggingModule.forRoot({ serviceName: "VCs Storage GraphQL module" })
  ],
  providers: [VcStorageGraphqlApiResolvers, VcStorageGraphqlApiService],
  exports: [VcStorageGraphqlApiService]
})
export class VcStorageGraphqlApiModule {}
