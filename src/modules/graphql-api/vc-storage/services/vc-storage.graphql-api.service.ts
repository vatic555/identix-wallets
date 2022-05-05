import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Did} from "@/libs/common/types/ssi.types";
import {UsersEntity, VcStorageEntity, VcVerificationCasesEntity} from "@/libs/database/entities";
import {TVCStorageCreate} from "@/modules/graphql-api/vc-storage/types";
import {VcVerificationStatusType} from "@/libs/database/types/vc-status.type";

@Injectable()
export class VcStorageGraphqlApiService {
  constructor(
    @InjectRepository(VcStorageEntity)
    private vcStorageRepository: Repository<VcStorageEntity>,
    @InjectRepository(VcVerificationCasesEntity)
    private vcVerificationCasesRepository: Repository<VcVerificationCasesEntity>,
    @InjectRepository(UsersEntity)
    private accountsRepository: Repository<UsersEntity>
  ) {}

  async createVC(params: TVCStorageCreate): Promise<VcStorageEntity> {
    const { vcDid, vcData, issuerDid, holderDid} = params;

    const vc = new VcStorageEntity();
    vc.vcDid = vcDid;
    vc.vcData = vcData;
    vc.issuerDid = issuerDid;
    vc.holderDid = holderDid;

    await this.vcStorageRepository.save(vc);

    return vc;
  }

  async getUserVCs(userDid: Did): Promise<VcStorageEntity[]> {
    const userVCs: Map<string, VcStorageEntity> = new Map<string, VcStorageEntity>();

    const userAsIssuerVCs = await this.vcStorageRepository.find({
          where: { issuerDid: userDid },
          relations: ['verificationCases']
        }
      );

    if (userAsIssuerVCs && userAsIssuerVCs.length > 0) {
      for (const vc of userAsIssuerVCs) {
        userVCs.set(vc.vcDid, vc);
      }
    }

    const userAsHolderVCs = await this.vcStorageRepository.find({
        where: { holderDid: userDid },
        relations: ['verificationCases']
      }
    );

    if (userAsHolderVCs && userAsHolderVCs.length > 0) {
      for (const vc of userAsHolderVCs) {
        userVCs.set(vc.vcDid, vc);
      }
    }

    const userAsVerifierVerificationCases = await this.vcVerificationCasesRepository.find({
      where: { verifierDid: userDid },
      relations: ['vc']
    });

    if (userAsVerifierVerificationCases && userAsVerifierVerificationCases.length > 0) {
      for await (const vcs of userAsVerifierVerificationCases) {
        const vc = await this.vcStorageRepository.findOne(vcs.vc.id, {
          relations: ['verificationCases']
        })

        userVCs.set(vc.vcDid, vc);
      }
    }

    return Array.from(userVCs.values());
  }

  async findVcByDid(vcDid: Did): Promise<VcStorageEntity> {
    return this.vcStorageRepository.findOne({
      where: { vcDid },
      relations: ['verificationCases']
    });
  }

  async findVcById(id: number): Promise<VcStorageEntity> {
    return this.vcStorageRepository.findOne(id, {
      relations: ['verificationCases']
    });
  }

  async deleteVcById(id: number): Promise<boolean> {
    return !!(await this.vcStorageRepository.delete({ id }));
  }

  async requestVcVerification(vcDid: Did, verifierDid: Did): Promise<boolean> {
    const vc = await this.vcStorageRepository.findOne({ vcDid });
    if (!vc) {
      throw new Error('VC not found');
    }

    let vcVerificationCase = (await this.vcVerificationCasesRepository.find({
        where: { verifierDid, vc: { vcDid } },
        relations: ['vc']
      })).shift();
    if (vcVerificationCase) {
      throw new Error(`The verification case already exists. Params: ${JSON.stringify({vcDid, verifierDid})}`);
    }

    vcVerificationCase = new VcVerificationCasesEntity();
    vcVerificationCase.vc = vc;
    vcVerificationCase.verifierDid = verifierDid;
    vcVerificationCase.verificationStatus = VcVerificationStatusType.PendingVerify;

    await this.vcVerificationCasesRepository.save(vcVerificationCase)
    await this.refreshVc(vc);

    return true;
  }

  async verifyVc(vcDid: Did, verifierDid: Did, verificationStatus: VcVerificationStatusType): Promise<boolean> {
    const vc = await this.vcStorageRepository.findOne({ vcDid });
    if (!vc) {
      throw new Error('VC not found');
    }

    const vcVerificationCase = (await this.vcVerificationCasesRepository.find({
        where: { verifierDid, vc: { vcDid } },
        relations: ['vc']
      })).shift();
    if (!vcVerificationCase) {
      throw new Error(`The verification case does not exist. Params: ${JSON.stringify({vcDid, verifierDid})}`);
    }

    if (vcVerificationCase.verificationStatus !== VcVerificationStatusType.PendingVerify) {
      throw new Error(`The verification case has already been verified. Params: ${JSON.stringify({vcDid, verifierDid})}`);
    }

    vcVerificationCase.verificationStatus = verificationStatus;
    await this.vcVerificationCasesRepository.save(vcVerificationCase)

    await this.refreshVc(vc);

    return true;
  }

  async refreshVc(vc: VcStorageEntity): Promise<void> {
    try {
      const vcVerificationCases =
        (await this.vcVerificationCasesRepository.find({
          where: { vc: { vcDid: vc.vcDid } },
          relations: ['vc']
        }))
        .map(vfc => ({ verifierDid: vfc.verifierDid, verificationStatus: vfc.verificationStatus }));

      const vcDataObj = JSON.parse(vc.vcData);
      vcDataObj.verificationCases = vcVerificationCases;
      vc.vcData = JSON.stringify(vcDataObj);

      await this.vcStorageRepository.save(vc);
    } catch (e) {
      throw new BadRequestException('Invalid vcData: it could not be parsed and refreshed as json object');
    }
  }
}
