import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class ChangeColumnLengthVcDataInVcStorage1651492529517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query( `ALTER TABLE "vc-storage" ALTER COLUMN "vcData" TYPE text`);
  }

  public async down(): Promise<void> {
  }
}
