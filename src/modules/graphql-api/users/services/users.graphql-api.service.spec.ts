import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DidsEntity, UsersEntity, Web2AccountsEntity, Web3AccountsEntity } from "@/libs/database/entities";
import { UsersGraphqlApiService } from "./users.graphql-api.service";

describe("UsersService", () => {
  let service: UsersGraphqlApiService;
  let didsRepositoryMock: Repository<DidsEntity>;
  const didsRepositoryToken = getRepositoryToken(DidsEntity);
  let usersRepositoryMock: Repository<UsersEntity>;
  const usersRepositoryToken = getRepositoryToken(UsersEntity);
  let web2AccountsRepositoryMock: Repository<Web2AccountsEntity>;
  const web2AccountsRepositoryToken = getRepositoryToken(Web2AccountsEntity);
  let web3AccountsRepositoryMock: Repository<Web3AccountsEntity>;
  const web3AccountsRepositoryToken = getRepositoryToken(Web3AccountsEntity);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: didsRepositoryToken,
          useValue: {
            findOne: () => ({}),
            save: () => ({})
          }
        },
        {
          provide: usersRepositoryToken,
          useValue: {
            findOne: () => ({}),
            save: () => ({})
          }
        },
        {
          provide: web2AccountsRepositoryToken,
          useValue: {
            findOne: () => ({}),
            save: () => ({})
          }
        },
        {
          provide: web3AccountsRepositoryToken,
          useValue: {
            findOne: () => ({}),
            save: () => ({})
          }
        },
        UsersGraphqlApiService
      ]
    }).compile();

    service = module.get<UsersGraphqlApiService>(UsersGraphqlApiService);
    didsRepositoryMock = module.get(didsRepositoryToken);
    usersRepositoryMock = module.get(usersRepositoryToken);
    web2AccountsRepositoryMock = module.get(web2AccountsRepositoryToken);
    web3AccountsRepositoryMock = module.get(web3AccountsRepositoryToken);

    jest.clearAllMocks();
  });

  describe("services", () => {
    it("should be defined", () => {
      expect(service).toBeDefined();
      expect(didsRepositoryMock).toBeDefined();
      expect(usersRepositoryMock).toBeDefined();
      expect(web2AccountsRepositoryMock).toBeDefined();
      expect(web3AccountsRepositoryMock).toBeDefined();
    });
  });

  describe("createUser()", () => {
    it("email is undefined: should trow error", async () => {
      let result;
      try {
        result = await service.getOrCreateAccount({});
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe("Either web2 or web3 parameters are required");
      }

      expect(result).toBeUndefined();
    });
  });
});
