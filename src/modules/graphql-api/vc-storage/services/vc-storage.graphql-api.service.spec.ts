import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UsersEntity, VcStorageEntity } from "@/libs/database/entities";
import { VcStorageGraphqlApiService } from "./vc-storage.graphql-api.service";

describe("VcStorageService", () => {
  let service: VcStorageGraphqlApiService;
  let accountsRepositoryMock: Repository<UsersEntity>;
  const accountsRepositoryToken = getRepositoryToken(UsersEntity);
  let vcStorageRepositoryMock: Repository<VcStorageEntity>;
  const vcStorageRepositoryToken = getRepositoryToken(VcStorageEntity);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: vcStorageRepositoryToken,
          useValue: {
            findOne: () => ({}),
            save: () => ({})
          }
        },
        {
          provide: accountsRepositoryToken,
          useValue: {
            findOne: () => ({}),
            save: () => ({})
          }
        },
        VcStorageGraphqlApiService
      ]
    }).compile();

    service = module.get<VcStorageGraphqlApiService>(VcStorageGraphqlApiService);
    accountsRepositoryMock = module.get(accountsRepositoryToken);
    vcStorageRepositoryMock= module.get(vcStorageRepositoryToken);

    jest.clearAllMocks();
  });

  describe("services", () => {
    it("should be defined", () => {
      expect(service).toBeDefined();
      expect(accountsRepositoryMock).toBeDefined();
      expect(vcStorageRepositoryMock).toBeDefined();
    });
  });
});
