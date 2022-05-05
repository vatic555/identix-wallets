import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { VcStorageEntity } from "@/libs/database/entities";
import { Did } from "@/libs/common/types/ssi.types";
import { TVCStorageCreate } from "@/modules/graphql-api/vc-storage/types";
import { SsoAuthGuard } from "@/modules/authentication/guards/sso-auth.guard";
import {VcStorageGraphqlApiService} from "@/modules/graphql-api/vc-storage/services/vc-storage.graphql-api.service";
import {VcVerificationStatusType} from "@/libs/database/types/vc-status.type";

@UseGuards(SsoAuthGuard)
@Resolver(of => VcStorageEntity)
export class VcStorageGraphqlApiResolvers {
  constructor(private vcStorageService: VcStorageGraphqlApiService) {}

  @Mutation(returns => VcStorageEntity)
  async createVC(
    @Args("vcDid", { type: () => String }) vcDid: string,
    @Args("vcData", { type: () => String }) vcData: string,
    @Args("issuerDid", { type: () => String }) issuerDid?: string | undefined,
    @Args("holderDid", { type: () => String }) holderDid?: string | undefined,
  ) {
    return this.vcStorageService.createVC({ vcDid, vcData, issuerDid, holderDid} as TVCStorageCreate);
  }

  @Query(returns => [VcStorageEntity])
  async getUserVCs(@Args("userDid", { type: () => String }) userDid: Did): Promise<VcStorageEntity[]> {
    return this.vcStorageService.getUserVCs(userDid);
  }

  @Query(returns => VcStorageEntity)
  async getVC(@Args("vcDid", { type: () => String }) vcDid: Did): Promise<VcStorageEntity> {
    return this.vcStorageService.findVcByDid(vcDid);
  }

  @Mutation(returns => Boolean)
  async deleteVC(@Args("id", { type: () => Int }) id: number) {
    return this.vcStorageService.deleteVcById(id);
  }

  @Mutation(returns => Boolean)
  async requestVcVerification(
    @Args("vcDid", { type: () => String! }) vcDid: Did,
    @Args("verifierDid", { type: () => String! }) verifierDid: Did) {
    return this.vcStorageService.requestVcVerification(vcDid, verifierDid);
  }

  @Mutation(returns => Boolean)
  async verifyVc(
    @Args("vcDid", { type: () => String! }) vcDid: Did,
    @Args("verifierDid", { type: () => String! }) verifierDid: Did,
    @Args("verificationStatus", { type: () => String! }) verificationStatus: VcVerificationStatusType) {
    return this.vcStorageService.verifyVc(vcDid, verifierDid, verificationStatus);
  }
}
