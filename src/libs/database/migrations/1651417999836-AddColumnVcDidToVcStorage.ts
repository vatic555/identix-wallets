import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddColumnVcDidToVcStorage1651417999836 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('vc-storage', [
      new TableColumn({
        name: 'vcDid',
        type: "varchar",
        length: "1024",
        isNullable: true,
        isUnique: true
      }),
    ]);

    const table = await queryRunner.getTable('vc-storage');
    const foreignKeyIssuerId = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('issuerId') !== -1,
    );
    await queryRunner.dropForeignKey('vc-storage', foreignKeyIssuerId);

    const foreignKeyHolderId = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('holderId') !== -1,
    );
    await queryRunner.dropForeignKey('vc-storage', foreignKeyHolderId);

    await queryRunner.changeColumns('vc-storage', [
      {
        oldColumn: new TableColumn({
          name: 'issuerId',
          type: 'int',
          isNullable: true,
        }),
        newColumn: new TableColumn({
          name: 'issuerDid',
          type: "varchar",
          length: "1024",
          isNullable: true,
        })
      },
      {
        oldColumn: new TableColumn({
          name: 'holderId',
          type: 'int',
          isNullable: true,
        }),
        newColumn: new TableColumn({
          name: 'holderDid',
          type: "varchar",
          length: "1024",
          isNullable: true,
        })
      },
    ]);
  }

  public async down(): Promise<void> {
  }
}
