import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class CreateTableVcVerifierCases1651418230236 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('vc-storage');
    const foreignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('verifierId') !== -1,
    );
    await queryRunner.dropForeignKey('vc-storage', foreignKey);

    await queryRunner.dropColumns('vc-storage', [
      new TableColumn({
        name: 'verifierId',
        type: "int"
      }),
      new TableColumn({
        name: 'status',
        type: 'vc_statuses'
      }),
    ]);

    await queryRunner.createTable(
      new Table({
        name: "vc-verifier-cases",
        columns: [
          new TableColumn({
            name: "id",
            type: "int",
            isGenerated: true,
            isPrimary: true,
            unsigned: true,
            generationStrategy: "increment"
          }),
          new TableColumn({
            name: "verifierDid",
            type: "varchar",
            length: "1024",
            isNullable: false
          }),
          new TableColumn({
            name: 'vcId',
            type: 'int',
            isNullable: true,
          }),
          new TableColumn({
            name: 'verificationStatus',
            type: 'vc_statuses',
            isNullable: true,
            default: 'NULL',
          }),
          new TableColumn({
            name: "createdAt",
            type: "timestamp",
            isNullable: true,
            default: "CURRENT_TIMESTAMP"
          }),
          new TableColumn({
            name: "updatedAt",
            type: "timestamp",
            isNullable: true,
            default: "CURRENT_TIMESTAMP"
          })
        ],
        foreignKeys: [
          new TableForeignKey({
            referencedTableName: 'vc-storage',
            referencedColumnNames: ['id'],
            columnNames: ['vcId'],
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
