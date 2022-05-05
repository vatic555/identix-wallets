import {BadRequestException, Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {DidsEntity, UsersEntity, Web2AccountsEntity, Web3AccountsEntity} from "@/libs/database/entities";
import {TAccountGetOrCreate, TGetOrCreateAccountResult} from "@/modules/graphql-api/users/types";

import { faker } from "@faker-js/faker";
import {Blockchains} from "@/libs/database/types/web3.types";

@Injectable()
export class UsersGraphqlApiService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(Web2AccountsEntity)
    private web2AccountsRepository: Repository<Web2AccountsEntity>,
    @InjectRepository(Web3AccountsEntity)
    private web3AccountsRepository: Repository<Web3AccountsEntity>,
    @InjectRepository(DidsEntity)
    private didsRepository: Repository<DidsEntity>
  ) {}

  async getOrCreateAccount(params: TAccountGetOrCreate): Promise<TGetOrCreateAccountResult> {
    const { web2, web3 } = params;

    if (!web2 && !web3) {
      throw new BadRequestException('Either web2 or web3 parameters are required');
    }

    if (web3) {
      const {blockchain, address} = web3;
      if (!blockchain || !address) {
        throw new BadRequestException('Web3 parameters blockchain and address are both required');
      }

      const web3Account =
        await this.web3AccountsRepository.findOne(
          { blockchain, address },
          { relations: ['dids'] }
        );

      if (web3Account) {
        return { dids: web3Account.dids.map(didEntity => didEntity.did) };
      }

      const { didEntity } = await this.createUserAccountsAndDid(params);

      return { dids: [didEntity.did] };
    }

    // Only web2 params are defined
    const {method: authMethod, identifier: authIdentifier} = web2;

    if (!authMethod || !authIdentifier) {
      throw new BadRequestException('Web2 parameters method and identifier are both required');
    }

    const web2Account =
      await this.web2AccountsRepository.findOne({ authMethod, authIdentifier });

    if (web2Account) {
      const web3Account =
        await this.web3AccountsRepository.findOne(
          { user: web2Account.user },
          { relations: ['dids']}
        );

      if (!web3Account) {
        throw new BadRequestException('Web3 account does not exist for user (but web2 account exists)');
      }

      return { dids: web3Account.dids.map(didEntity => didEntity.did) };
    }

    const { didEntity } = await this.createUserAccountsAndDid(params);

    return { dids: [didEntity.did] };
  }

  async findById(id: number): Promise<UsersEntity> {
    return this.usersRepository.findOne(id);
  }

  async deleteById(id: number): Promise<boolean> {
    return !!(await this.usersRepository.delete({ id }));
  }

  /**
   * Generates public and private keys pair
   *
   * @private
   */
  private async generateKeys(): Promise<{public: string, private: string}> {
    return {
      public: faker.random.alphaNumeric(30),
      private: faker.random.alphaNumeric(30)
    }
  }

  /**
   * Creates Did
   *
   * @param publicKey
   * @private
   */
  private async createDid(publicKey: string): Promise<string> {
    return `did:ever:${faker.random.alphaNumeric(30)}`
  }

  /**
   * Creates User, Web2Account (if web2 params exist), Web3Account and DidEntity
   * @param params
   * @private
   */
  private async createUserAccountsAndDid(params: TAccountGetOrCreate):
    Promise<{
      user: UsersEntity,
      web2Account: Web2AccountsEntity | undefined,
      web3Account: Web3AccountsEntity,
      didEntity: DidsEntity
  }> {
    const { web2, web3 } = params;

    const user = new UsersEntity();
    await this.usersRepository.save(user);

    let web2Account;
    if (web2) {
      const {method: authMethod, identifier: authIdentifier} = web2;
      web2Account = new Web2AccountsEntity();
      web2Account.authMethod = authMethod;
      web2Account.authIdentifier = authIdentifier;
      web2Account.user = user;

      await this.web2AccountsRepository.save(web2Account);
    }

    const { blockchain, address } = web3 || {};
    const { public: publicKey, private: privateKey } = await this.generateKeys();

    const web3Account = new Web3AccountsEntity();
    web3Account.user = user;
    if (blockchain) {
      const blockchains = [Blockchains.polygon, Blockchains.everscale];
      if (!blockchains.includes(blockchain)) {
        throw new BadRequestException(`Parameter blockchain should be one of ${blockchains}`);
      }
      web3Account.blockchain = blockchain;
    }
    if (address) {
      web3Account.address = address;
    }
    web3Account.publicKey = publicKey;
    web3Account.privateKey = privateKey;
    await this.web3AccountsRepository.save(web3Account);

    const did = await this.createDid(publicKey);
    const didEntity = new DidsEntity();

    didEntity.web3Account = web3Account;
    didEntity.did = did;
    await this.didsRepository.save(didEntity);

    user.nickname = did;
    await this.usersRepository.save(user);

    return { user, web2Account, web3Account, didEntity };
  }
}
