import { Module } from "@nestjs/common";

import { UsersGraphqlApiModule } from "@/modules/graphql-api/users/users.graphql-api.module";
import { VcStorageGraphqlApiModule } from "@/modules/graphql-api/vc-storage/vc-storage.graphql-api.module";

@Module({
  imports: [UsersGraphqlApiModule, VcStorageGraphqlApiModule],
  providers: [],
  exports: []
})
export class GraphQLApiModule {}
